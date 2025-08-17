from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql.types import IntegerType

from utils import (
    CollocationsStatsSchema,
    DataLoader,
    SilverDataExtractor,
    SilverDataTransformer,
    SparkBase,
    get_etl_conn_uri,
)


def main() -> None:
    conn = get_etl_conn_uri()

    sb = SparkBase(conn=conn, spark_name='silver-etl')

    spark: SparkSession = sb.spark

    # E
    extractor = SilverDataExtractor(spark=spark, database='shakespeare', collection='bronzeIndices')
    idx_tokens_extractor = SilverDataExtractor(spark=spark, database='shakespeare', collection='bronzeIdxTokens')
    raw_indices = extractor.extract(source='mongo').drop('_id')
    works_years = extractor.extract(source='s3')
    raw_idx_tokens = idx_tokens_extractor.extract(source='mongo').drop('_id')

    # T
    transformer = SilverDataTransformer()
    normalised_words = transformer.transform(raw_indices, to='normalise')
    works_years = works_years.select(col('document'), col('year').cast(IntegerType()).alias('year'))

    collocations_stats_rdd = transformer.transform(data=raw_idx_tokens, to='collocations_stats')
    collocations_stats_schema = CollocationsStatsSchema.get()
    collocations_stats_df = spark.createDataFrame(collocations_stats_rdd, schema=collocations_stats_schema)

    # L
    for collection, dataframe in {
        'silverWords': normalised_words
        , 'silverWorksYears': works_years
        , 'silverCollocationsStats': collocations_stats_df
    }.items():
        DataLoader(spark=spark).load(
            data=dataframe
            , database='shakespeare'
            , collection=collection
            , write_mode='overwrite'
        )


if __name__ == "__main__":
    main()

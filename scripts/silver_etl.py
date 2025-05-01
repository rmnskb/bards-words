from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql.types import IntegerType

from utils import (
    get_etl_conn_uri, SilverDataExtractor, SilverDataTransformer, DataLoader, SparkBase
)


def main() -> None:
    conn = get_etl_conn_uri()

    sb = SparkBase(conn=conn, spark_name='silver-etl')

    spark: SparkSession = sb.spark

    # E
    extractor = SilverDataExtractor(spark=spark, database='shakespeare', collection='bronzeIndices')
    raw_indices = extractor.extract(source='mongo').drop('_id')
    works_years = extractor.extract(source='s3')

    # T
    data = SilverDataTransformer.transform(raw_indices)
    works_years = works_years.select(col('document'), col('year').cast(IntegerType()).alias('year'))

    # L
    for collection, dataframe in {
        'silverWords': data
        , 'silverWorksYears': works_years
    }.items():
        DataLoader(spark=spark).load(
            data=dataframe
            , database='shakespeare'
            , collection=collection
            , write_mode='overwrite'
        )


if __name__ == "__main__":
    main()

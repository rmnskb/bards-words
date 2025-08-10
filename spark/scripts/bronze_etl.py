from pyspark import SparkContext, RDD
from pyspark.sql import SparkSession, DataFrame

# Spark's dependency management guide suggests
# decompressing the local dependency directories into .zip files
# and then submitting them along with the actual job as a dependency
# via spark-submit --py-files <dependency>.zip shakespeare_etl.py
from utils import (
    get_etl_conn_uri, BronzeDataExtractor, BronzeDataTransformer, DataLoader, SparkBase, TokensSchema,
    InvertedIndexSchema, IndexedTokensSchema
)


def main():
    conn = get_etl_conn_uri()

    sb = SparkBase(conn=conn, sc_name='shakespeare-et-from-etl', spark_name='shakespeare-l-from-etl')

    sc: SparkContext = sb.sc

    spark: SparkSession = sb.spark

    # E from ETL
    BronzeDataExtractor.extract(source='aws')
    raw_data = sc.wholeTextFiles(f"s3a://{BronzeDataExtractor.s3_bucket}/*.txt")

    # T from ETL
    transformer = BronzeDataTransformer(sc=sc)
    tokens: RDD = transformer.transform(to='tokens', data=raw_data)
    indexed_tokens: RDD = transformer.transform(to='indexed_tokens', data=tokens)
    inverted_idx: RDD = transformer.transform(to='inverted_index', data=tokens)

    # L from ETL
    # Predefine the RDD schemas for conversion to DataFrames
    tokens_schema = TokensSchema.get()

    indexed_tokens_schema = IndexedTokensSchema.get()

    inverted_idx_schema = InvertedIndexSchema.get()

    tokens_df: DataFrame = spark.createDataFrame(tokens, schema=tokens_schema)
    indexed_tokens_df: DataFrame = spark.createDataFrame(indexed_tokens, schema=indexed_tokens_schema)
    inverted_idx_df: DataFrame = spark.createDataFrame(inverted_idx, schema=inverted_idx_schema)

    loader = DataLoader(spark=spark)

    for collection, dataframe in {
        'bronzeTokens': tokens_df
        , 'bronzeIdxTokens': indexed_tokens_df
        , 'bronzeIndices': inverted_idx_df
    }.items():
        loader.load(
            data=dataframe
            , database='shakespeare'
            , collection=collection
            , write_mode='overwrite'
        )


if __name__ == "__main__":
    main()

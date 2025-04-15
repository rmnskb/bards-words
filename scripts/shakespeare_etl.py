from pyspark import SparkContext, SparkConf, RDD
from pyspark.sql import SparkSession, DataFrame
from pyspark.sql.types import StructType, StructField, StringType, ArrayType, IntegerType

# Spark's dependency management guide suggests
# decompressing the local dependency directories into .zip files
# and then submitting them along with the actual job as a dependency
# via spark-submit --py-files <dependency>.zip shakespeare_etl.py
from utils import get_conn_uri, DataExtractor, DataTransformer, DataLoader


def main():
    conn = get_conn_uri(db='shakespeare', collection='words')

    # Update the Spark Config with Connection URI programmatically
    conf = (
        SparkConf()
        .set('spark.mongodb.read.connection.uri', conn)
        .set('spark.mongodb.write.connection.uri', conn)
    )

    sc = SparkContext(appName="shakespeare-et-from-etl", conf=conf)

    spark = (
        SparkSession
        .builder
        .appName('shakespeare-l-from-etl')
        .config(conf=conf)
        .getOrCreate()
    )

    # E from ETL
    DataExtractor.extract()
    raw_data = sc.wholeTextFiles(str(DataExtractor.data_folder))

    # T from ETL
    transformer = DataTransformer(sc=sc)
    tokens: RDD = transformer.transform(to='tokens', data=raw_data)
    inverted_idx: RDD = transformer.transform(to='inverted_index', data=tokens)

    # L from ETL
    # Predefine the RDD schemas for conversion to DataFrames
    tokens_schema = StructType([
        StructField('document', StringType())
        , StructField('occurrences', ArrayType(StringType()))
    ])

    document_freq_structure = StructType([
        StructField('document', StringType(), False)
        , StructField('frequency', IntegerType(), False)
        , StructField('indices', ArrayType(
            IntegerType(), False
        ), False)
    ])

    inverted_idx_schema = StructType([
        StructField('word', StringType(), False)
        , StructField('occurrences', ArrayType(document_freq_structure), False)
    ])

    tokens_df: DataFrame = spark.createDataFrame(tokens, schema=tokens_schema)
    inverted_idx_df: DataFrame = spark.createDataFrame(inverted_idx, schema=inverted_idx_schema)

    # Side Effects from ETL
    print(tokens_df.printSchema())
    print(inverted_idx_df.printSchema())

    loader = DataLoader(spark=spark)

    loader.load(
        data=tokens_df
        , database='shakespeare'
        , collection='tokens'
        , write_mode='overwrite'
    )

    loader.load(
        data=inverted_idx_df
        , database='shakespeare'
        , collection='indices'
        , write_mode='overwrite'
    )


if __name__ == "__main__":
    main()

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
    data: RDD = transformer.transform(data=raw_data)

    # L from ETL
    # Predefine the RDD schema for conversion to DataFrame
    schema = StructType([
        StructField('word', StringType(), False)
        , StructField('occurrences', ArrayType(
            StructType([
                StructField('document_name', StringType(), False)
                , StructField('count', IntegerType(), False)
            ])
        ), False)
    ])

    df: DataFrame = spark.createDataFrame(data, schema=schema)

    # Side Effects from ETL
    print(df.show(n=50, truncate=False))

    loader = DataLoader(spark=spark)

    loader.load(
        data=df
        , database='shakespeare'
        , collection='words'
        , write_mode='overwrite'
    )


if __name__ == "__main__":
    main()

from pyspark import SparkConf, SparkContext
from pyspark.sql import SparkSession, DataFrame

from utils import get_conn_uri


def main() -> None:
    conn = get_conn_uri(db="shakespeare", collection="words")

    conf = (
        SparkConf()
        .set('spark.mongodb.read.connection.uri', conn)
        .set('spark.mongodb.write.connection.uri', conn)
    )

    sc = SparkContext(appName='shakespeare-analytics-sc', conf=conf)

    spark = (
        SparkSession(sc)
        .builder
        .getOrCreate()
    )

    df: DataFrame = (
        spark.read
        .format("mongodb")
        .option("database", "shakespeare")
        .option("collection", "words")
        .load()
    )

    print(df.show(50))


if __name__ == "__main__":
    main()

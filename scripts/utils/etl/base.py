from typing import TypeAlias, Optional

from pyspark import RDD, SparkConf, SparkContext
from pyspark.sql import SparkSession, DataFrame

SparkDataAbstract: TypeAlias = RDD | DataFrame


class SparkBase:

    def __init__(
            self
            , conn: Optional[str] = ''
            , sc_name: Optional[str] = 'generic-sc-app-name'
            , spark_name: Optional[str] = 'generic-spark-app-name'
    ):
        # Update the Spark Config with Connection URI programmatically
        self._conf = (
            SparkConf()
            .set('spark.mongodb.read.connection.uri', conn)
            .set('spark.mongodb.write.connection.uri', conn)
        )

        self._sc = SparkContext(appName=sc_name, conf=self._conf)

        self._spark = (
            SparkSession
            .builder
            .appName(spark_name)
            .config(conf=self._conf)
            .getOrCreate()
        )

    @property
    def sc(self) -> SparkContext:
        return self._sc

    @property
    def spark(self) -> SparkSession:
        return self._spark

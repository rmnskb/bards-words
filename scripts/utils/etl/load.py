from typing import Optional, Literal

from pyspark import RDD
from pyspark.sql import SparkSession
from pyspark.sql.types import StructType

from .base import SparkDataAbstract


class DataLoader:

    def __init__(self, spark: SparkSession):
        self.spark = spark

    def load(
            self
            , data: SparkDataAbstract
            , database: str
            , collection: str
            , schema: Optional[StructType] = None
            , write_mode: Literal['overwrite', 'append'] = 'overwrite'
    ) -> None:
        spark = self.spark

        if isinstance(data, RDD):
            data = spark.createDataFrame(data=data, schema=schema)

        (
            data.write
            .format('mongodb')
            .mode(write_mode)
            .option('database', database)
            .option('collection', collection)
            .save()
        )

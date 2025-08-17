from typing import Literal, Optional

from pyspark import RDD
from pyspark.sql import DataFrame, SparkSession
from pyspark.sql.types import StructType

from .base import SparkDataAbstract


class DataLoader:

    def __init__(self, spark: SparkSession) -> None:
        self._spark = spark

    def _convert_rdd_to_df(
        self,
        data: SparkDataAbstract,
        schema: Optional[StructType],
    ) -> DataFrame:
        if not isinstance(data, RDD):
            return data

        if schema is None:
            raise ValueError("Please specify the schema when loading RDD data to DB")

        return self._spark.createDataFrame(data=data, schema=schema)

    def load(
        self,
        data: SparkDataAbstract,
        database: str,
        collection: str,
        schema: Optional[StructType] = None,
        write_mode: Literal['overwrite', 'append'] = 'overwrite',
    ) -> None:

        df = self._convert_rdd_to_df(data, schema)

        (
            df
            .write
            .format('mongodb')
            .mode(write_mode)
            .option('database', database)
            .option('collection', collection)
            .save()
        )

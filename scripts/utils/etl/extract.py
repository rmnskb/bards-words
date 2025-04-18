import os
import subprocess
from pathlib import Path

from pyspark.sql import DataFrame, SparkSession


class BronzeDataExtractor:
    """
    This class is a wrapper around './acquire-data.sh' shell script
    that actually ingests .txt data to '../data/' folder.
    This object is not supposed to be instantiated.
    """
    cwd = Path.cwd()
    data_folder = cwd.parent.joinpath('data')

    @classmethod
    def extract(cls) -> None:
        if not os.listdir(cls.data_folder):  # Check if the directory is empty
            subprocess.call(['sh', './acquire-data.sh'])
            print(f'Empty directory {cls.data_folder} was populated successfully.')
            return

        print(f'The data folder {cls.data_folder} already has data, terminating the extract process.')


class SilverDataExtractor:

    def __init__(
            self
            , spark: SparkSession
            , database: str
            , collection: str
    ) -> None:
        self._spark = spark
        self._database = database
        self._collection = collection

    def extract(self) -> DataFrame:
        return self._spark.read \
            .format("mongodb") \
            .option("database", self._database) \
            .option("collection", self._collection) \
            .load()

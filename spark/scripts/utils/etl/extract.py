import os
import subprocess
from pathlib import Path
from typing import Literal, Optional

import boto3
from pyspark.sql import DataFrame, SparkSession


class _MongoDataExtractor:

    def __init__(
        self,
        spark: SparkSession,
        collection: str,
        database: Optional[str] = None,
    ) -> None:
        self._spark = spark
        self._collection = collection
        self._database = database if database else 'shakespeare'

    @property
    def data(self) -> DataFrame:
        return self._spark.read \
            .format("mongodb") \
            .option("database", self._database) \
            .option("collection", self._collection) \
            .load()


class BronzeDataExtractor:
    """
    This class is a wrapper around './acquire-data.sh' shell script
    that actually ingests .txt data to either '../data/' folder or S3 bucket.
    This object is not supposed to be instantiated.
    """
    data_folder = Path.cwd().parent.joinpath('data')
    s3_bucket = os.environ['AWS_S3_BUCKET']

    @classmethod
    def extract(cls, source: Literal['local', 'aws']) -> None:
        match source:
            case 'local':
                if not os.listdir(cls.data_folder):  # Check if the directory is empty
                    subprocess.call(['sh', './acquire-data.sh', source])
                    print(f'Empty directory {cls.data_folder} was populated successfully.')
                    return

                print(f'The data folder {cls.data_folder} already has data, terminating the extract process.')
            case 'aws':
                client = boto3.client('s3')
                results = client.list_objects(Bucket=cls.s3_bucket)
                if not results.get('Contents'):
                    subprocess.call(['sh', './acquire-data.sh', source, cls.s3_bucket])
                    print(f'Empty bucket {cls.s3_bucket} was populated successfully.')
                    return

                print(f'The bucket {cls.s3_bucket} has {len(results["Contents"])} files')
            case _:
                raise ValueError(f"Invalid target: {source}; Possible values are local, aws.")


class SilverDataExtractor:
    s3_bucket = os.environ['AWS_S3_BUCKET']

    def __init__(
            self
            , spark: SparkSession
            , database: str
            , collection: str
    ) -> None:
        self._spark = spark
        self._database = database
        self._collection = collection

    def extract(self, source: Literal['mongo', 's3'] = 'mongo') -> DataFrame:
        match source:
            case 'mongo':
                return _MongoDataExtractor(spark=self._spark, collection=self._collection).data
            case 's3':
                return self._spark.read \
                    .option("multiline", True) \
                    .json(f's3a://{self.s3_bucket}/worksYears.json')
            case _:
                raise ValueError(f"Invalid destination: {source}; Possible values are mongo, s3.")


class GoldDataExtractor:

    def __init__(self, spark: SparkSession, collections: list[str]) -> None:
        self._spark = spark
        self._collections = collections

    def extract(self) -> list[DataFrame]:
        return [
            _MongoDataExtractor(spark=self._spark, collection=collection).data for collection in self._collections
        ]

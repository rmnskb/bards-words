import os
import subprocess
from pathlib import Path
from typing import Literal

import boto3

from pyspark.sql import DataFrame, SparkSession


class BronzeDataExtractor:
    """
    This class is a wrapper around './acquire-data.sh' shell script
    that actually ingests .txt data to either '../data/' folder or S3 bucket.
    This object is not supposed to be instantiated.
    """
    data_folder = Path.cwd().parent.joinpath('data')
    s3_bucket = os.environ['S3_BUCKET']

    @classmethod
    def extract(cls, target: Literal['local', 'aws']) -> None:
        match target:
            case 'local':
                if not os.listdir(cls.data_folder):  # Check if the directory is empty
                    subprocess.call(['sh', './acquire-data.sh', target])
                    print(f'Empty directory {cls.data_folder} was populated successfully.')
                    return

                print(f'The data folder {cls.data_folder} already has data, terminating the extract process.')
            case 'aws':
                client = boto3.client('s3')
                results = client.list_objects(Bucket=cls.s3_bucket)
                if not results.get('Contents'):
                    subprocess.call(['sh', './acquire-data.sh', target, cls.s3_bucket])
                    print(f'Empty bucket {cls.s3_bucket} was populated successfully.')
                    return

                print(f'The bucket {cls.s3_bucket} has {len(results["Contents"])} files')
            case _:
                raise ValueError(f"Invalid target: {target}; Possible values are local, aws.")


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

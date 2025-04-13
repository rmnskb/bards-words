from pathlib import Path
from typing import TypeAlias

from pyspark import RDD
from pyspark.sql import DataFrame

SparkDataAbstract: TypeAlias = RDD | DataFrame


class DataETL:
    cwd = Path.cwd()
    data_folder = cwd.parent.joinpath('data')

import os
import re
from pathlib import Path
from typing import TypeAlias

from pyspark import SparkContext, RDD

spark = SparkContext()
cwd = Path.cwd()
data_path: Path = cwd.parent.joinpath('data')
NameContentType: TypeAlias = tuple[str, str]

# Take only one element for test purposes
texts: RDD[NameContentType] = spark.wholeTextFiles(str(data_path))


def beautify_name(title_page: str) -> str:
    """
    The general pattern of the .txt files is that they start with the name of the play
    This function exploits this pattern with RegEx
    :param title_page: string with the play's beginning
    :return: the matched name
    """
    return re.match(r'^.*?(?=\r)', title_page)[0]


text: RDD[NameContentType] = texts.map(lambda entry: (beautify_name(entry[1][:50]), entry[1][:100]))
# text: RDD[NameContentType] = text.map(lambda entry: (beautify_name(entry[0]), entry[1]))

print(text.collect())

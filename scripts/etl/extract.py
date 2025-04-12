import os
import subprocess

from .base import DataETL


class DataExtractor(DataETL):
    """
    This class is a wrapper around './acquire-data.sh' shell script
    that actually ingests .txt data to '../data/' folder.
    This object is not supposed to be instantiated.
    """

    @classmethod
    def extract(cls) -> None:
        if not os.listdir(cls.data_folder):  # Check if the directory is empty
            subprocess.call(['sh', './acquire-data.sh'])
            print(f'Empty directory {cls.data_folder} was populated successfully.')
            return

        print(f'The data folder {cls.data_folder} already has data, terminating the extract process.')

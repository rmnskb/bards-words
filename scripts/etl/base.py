from pathlib import Path


class DataETL:
    cwd = Path.cwd()
    data_folder = cwd.parent.joinpath('data')

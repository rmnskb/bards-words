from pymongo.database import Database


class RepoService:

    def __init__(self, db: Database) -> None:
        self._db = db


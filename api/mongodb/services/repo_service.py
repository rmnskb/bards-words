from pymongo.asynchronous.database import AsyncDatabase


class RepoService:

    def __init__(self, db: AsyncDatabase) -> None:
        self._db: AsyncDatabase = db


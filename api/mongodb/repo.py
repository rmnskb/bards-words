import os

from pymongo import AsyncMongoClient
from pymongo.asynchronous.database import AsyncDatabase

if not os.getenv("HOST"):
    # Local Dev Workaround
    from dotenv import load_dotenv
    load_dotenv()


class _MongoRepository:

    def __init__(self):
        uri = self._get_conn_uri()
        self._client = AsyncMongoClient(uri)

    @staticmethod
    def _get_conn_uri() -> str:
        user = os.getenv("DB_API_USER")
        pwd = os.getenv("DB_API_PWD")
        host = os.getenv("HOST")
        port = os.getenv("MONGODB_PORT")

        return f"mongodb://{user}:{pwd}@{host}:{port}/shakespeare?authSource=shakespeare"

    @property
    def client(self) -> AsyncMongoClient:
        return self._client


class ShakespeareRepository(_MongoRepository):

    def __init__(self):
        super().__init__()
        self._db = self.client['shakespeare']

    @property
    def db(self) -> AsyncDatabase:
        return self._db
 
    async def create_indices(self) -> None:
        await self._db.bronzeIndices.create_index(
            [("word", "text")]
        )


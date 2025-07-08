import os

from pymongo import AsyncMongoClient
from pymongo.database import Database

from .models import (
    InvertedIndexItem, TokensItem, WordDimensionsItem,
    CollocationsStatsItem
)
from .services import TokensService, StatsService, AdjacentIndicesType


class _MongoRepository:

    def __init__(self):
        uri = self._get_conn_uri()
        self._client = AsyncMongoClient(uri)

    @staticmethod
    def _get_conn_uri() -> str:
        user = os.getenv("DB_API_USER")
        pwd = os.getenv("DB_API_PWD")
        host = "mongodb"
        port = 27017

        return f"mongodb://{user}:{pwd}@{host}:{port}/shakespeare?authSource=shakespeare"

    @property
    def client(self) -> AsyncMongoClient:
        return self._client


class ShakespeareRepository(_MongoRepository):

    def __init__(self):
        super().__init__()
        self._db = self.client['shakespeare']

    @property
    def db(self) -> Database:
        return self._db
 
    async def create_indices(self) -> None:
        await self._db.bronzeIndices.create_index(
            [("word", "text")]
        )

    async def _find_words(self, words: list[str]) -> list[InvertedIndexItem]:
        results: list[InvertedIndexItem] = []

        for word in words:
            if item := await self.find_word(word):
                results.append(item)

        return results
 
    async def find_tokens(self, document: str, start: int, limit: int) -> TokensItem:
        return await TokensService(self._db).find_tokens(document, start, limit)

    async def find_phrase_indices(self, words: list[str]) -> AdjacentIndicesType:
        words_list = await self._find_words(words)

        return await TokensService(self._db).find_phrase_indices(words_list)
 
    async def get_document(self, document: str) -> TokensItem:
        return await TokensService(self._db).get_document(document)

    async def get_stats(self, word: str) -> WordDimensionsItem:
        return await StatsService(self._db).get_stats(word)

    async def get_collocations_stats(self, word: str) -> CollocationsStatsItem:
        return await StatsService(self._db).get_collocations_stats(word)

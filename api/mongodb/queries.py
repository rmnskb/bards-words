import os
import re

from pymongo import AsyncMongoClient

from .models import InvertedIndexItem


class _MongoRepository:

    def __init__(self):
        uri = self._get_conn_uri()
        self._client = AsyncMongoClient(uri)

    @staticmethod
    def _get_conn_uri():
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

    async def find_word(self, word: str) -> InvertedIndexItem:
        """
        Return the best match for the given word,
        works like SQL LIKE %word% query

        :param word: the search criteria
        :return: BSON match output
        """
        regexp = re.compile(rf".*{word}.*", re.IGNORECASE)

        result = await self._db.bronzeIndices.find_one({"word": regexp})

        if result:
            return InvertedIndexItem(**result)

    async def find_words(self, words: list[str]) -> list[InvertedIndexItem]:
        results: list[InvertedIndexItem] = []

        for word in words:
            if item := await self.find_word(word):
                results.append(item)

        return results

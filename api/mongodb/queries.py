import os
import re
from typing import Optional
from collections import defaultdict

import asyncio
from pymongo import AsyncMongoClient

from .models import InvertedIndexItem, TokensItem


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

    async def find_tokens(self, document: str, start: int, limit: int) -> TokensItem:
        """
        Get the tokens (words) from the given document
        :param document: name of the document
        :param start: start position of the tokens slice
        :param limit: number of tokens to return
        :return: a hash map of document and respective tokens within given range
        """
        result = await self._db.bronzeTokens.find_one(
            {"document": document}
            , {"occurrences": {"$slice": [start, limit]}}
        )

        if result:
            return TokensItem(**result)

    async def find_phrase_indices(self, words: list[str]) -> dict[str, list[int]]:
        """
        Find in what documents and where in particular given words appear together
        :param words: a list of words, i.e a phrase (e.g. "All that glisters is not gold")
        :return: a dictionary with document name as key and a list of indices as value
        """

        def find_docs_intersection(attributes: list[dict[str, ...]]) -> Optional[set[str]]:
            """
            Traverse the list of given words,
            find the documents that are common for all documents
            :param attributes: list of all and their respective attributes
            :return: a set of common documents
            """
            documents_hash: dict[str, set[str]] = {
                item['word']: set([document['document'] for document in item['occurrences']])
                for item in attributes
            }

            # Find the intersection of all documents
            docs: set[str] = set()
            for _, documents in documents_hash.items():
                docs = documents.copy() if not docs else docs.intersection(documents)

            return docs

        def get_adjacent_indices(docs_occur: dict[str, list[int]]) -> dict[str, list[int]]:
            """
            Get the indices of words that are adjacent in the given documents
            :param docs_occur: a dictionary mapping words indices to documents
            :return:
            """
            # Yes, a lambda function as a variable, mentally preparing myself for TS + React frontend part
            # Btw courtesy of https://stackoverflow.com/questions/42868875
            calculate_adjacent_diff = lambda array: [(array[i] - array[i + 1]) for i in range(0, len(array) - 1)]
            adjacent_indices = {}

            for document, occurs in docs_occur.items():
                adjacent_diff = calculate_adjacent_diff(sorted(occurs))

                if -1 not in adjacent_diff and -2 not in adjacent_diff:
                    continue

                # Get the list of indices of the words that are adjacent
                indices = [(i, i + 1) for i, val in enumerate(adjacent_diff) if val == -1]
                flat_indices = list(sum(indices, ()))  # Flatten the list of indices
                adjacent_indices[document] = sorted([occurs[i] for i in flat_indices])

            return adjacent_indices

        results_raw = await self.find_words(words=words)
        results = [item.model_dump() for item in results_raw]  # Convert the pydantic models to Python dicts

        common_docs = find_docs_intersection(attributes=results)
        document_occurrences: dict[str, list[int]] = defaultdict(list)

        for result in results:
            for occurrence in result['occurrences']:
                document_occurrences[occurrence['document']].extend(
                    occurrence['indices'] if occurrence['document'] in common_docs else []
                )

        return get_adjacent_indices(docs_occur=document_occurrences)


if __name__ == "__main__":
    repo = ShakespeareRepository()
    # result = asyncio.run(repo.find_tokens("The Comedy of Errors", 1000, 100))
    res = asyncio.run(repo.find_word("life"))
    print(res)

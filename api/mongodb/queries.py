import os
import re
from typing import Optional, TypeVar
from collections import defaultdict
from itertools import groupby

import asyncio

import pymongo
from pymongo import AsyncMongoClient

from .models import InvertedIndexItem, TokensItem

T = TypeVar('T')


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

    async def find_word(self, word: str) -> InvertedIndexItem:
        """
        Return the best match for the given word,
        works like SQL LIKE %word% query

        :param word: the search criteria
        :return: BSON match output
        """
        regexp = re.compile(rf"^{word}$", re.IGNORECASE)

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

    async def find_phrase_indices(self, words: list[str]) -> dict[str, list[list[int]]]:
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

        def get_consecutive_subsequences(sequence: list[T], length: int) -> list[list[T]]:
            """
            Divide the list into subsequences of length n, if there are no subsequences, return an empty list
            :param sequence: a list to draw the subsequences from
            :param length: the length of the subsequences to return
            :return: a list of subsequences of the given length
            """
            sorted_seq = sorted(sequence)

            runs = []
            current_run = [sorted_seq[0]]

            for i in range(1, len(sorted_seq)):
                if sorted_seq[i] == sorted_seq[i - 1] + 1:
                    current_run.append(sorted_seq[i])
                else:
                    if len(current_run) >= length:
                        runs.append(current_run[:])
                    current_run = [sorted_seq[i]]

            if len(current_run) >= length:
                runs.append(current_run)

            if not runs:
                return []

            outcome = []
            for run in runs:
                for i in range(len(run) - length + 1):
                    outcome.append(run[i: i + length])

            return outcome

        def get_adjacent_indices(docs_occur: dict[str, list[int]], n: int) -> dict[str, list[list[int]]]:
            """
            Get the indices of words that are adjacent in the given documents
            :param docs_occur: a dictionary mapping words indices to documents
            :param n: number of words to check against
            :return:
            """
            # Yes, a lambda function as a variable, mentally preparing myself for TS + React frontend part
            # Btw courtesy of https://stackoverflow.com/questions/42868875
            calculate_adjacent_diff = lambda array: [(array[i] - array[i + 1]) for i in range(0, len(array) - 1)]
            adjacent_indices = {}

            for document, occurs in docs_occur.items():
                unique_occurs = sorted(list(set(occurs)))
                adjacent_diff = calculate_adjacent_diff(unique_occurs)

                # To avoid partial matches,
                # the number of adjacent words must match with the number of words in the query,
                # and they must be consecutive
                no_adjacent_elems = -1 not in adjacent_diff
                diffs_not_consecutive = [-1] * (n - 1) not in [list(group[1]) for group in groupby(adjacent_diff)]

                if no_adjacent_elems or diffs_not_consecutive:
                    continue

                # Get the list of indices of the words that are adjacent
                indices = [(i, i + 1) for i, val in enumerate(adjacent_diff) if val == -1]
                flat_indices = list(sum(indices, ()))  # Flatten the list of indices
                adjacent_occurrences = list(set([unique_occurs[i] for i in flat_indices]))
                adjacent_indices[document] = get_consecutive_subsequences(adjacent_occurrences, length=n)

            return adjacent_indices

        results_raw = await self.find_words(words=words)
        results = [item.model_dump() for item in results_raw]  # Convert the pydantic models to Python dicts
        words_num = len(words) if isinstance(words, list) else 1

        common_docs = find_docs_intersection(attributes=results)
        document_occurrences: dict[str, list[int]] = defaultdict(list)

        for result in results:
            for occurrence in result['occurrences']:
                document_occurrences[occurrence['document']].extend(
                    occurrence['indices'] if occurrence['document'] in common_docs else []
                )

        return get_adjacent_indices(docs_occur=document_occurrences, n=words_num)

    async def find_matches(self, word: str) -> list[InvertedIndexItem]:
        """
        Find matches for a given word using mongo's built-in text search
        :param word: a textual representation of human sounds, what do you think it might be
        :return: a list of InvertedIndexItem objects containing the matches
        """
        results: list[InvertedIndexItem] = []

        async for result in self._db.bronzeIndices.find(
                {"$text": {"$search": word}},
                {"score": {"$meta": "textScore"}}
        ).sort("score", pymongo.DESCENDING):
            if result is not None:
                results.append(InvertedIndexItem(**result))

        if results:
            return results


if __name__ == "__main__":
    repo = ShakespeareRepository()
    # result = asyncio.run(repo.find_tokens("The Comedy of Errors", 1000, 100))
    res = asyncio.run(repo.find_word("life"))
    print(res)

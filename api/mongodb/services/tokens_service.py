from itertools import groupby
from collections import defaultdict
from typing import Optional, TypeVar, TypeAlias, Callable

from .repo_service import RepoService
from .word_service import WordService
from ..models import TokensItem, InvertedIndexItem

T = TypeVar('T')
DocumentOccurrencesType: TypeAlias = dict[str, list[int]]
AdjacentIndicesType: TypeAlias = dict[str, list[list[int]]]


class TokensService(RepoService):

    @staticmethod
    def _find_docs_intersection(attributes: list[dict[str, ...]]) -> Optional[set[str]]:
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

    @staticmethod
    def _get_consecutive_subsequences(sequence: list[T], length: int) -> list[list[T]]:
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

    @staticmethod
    def _calculate_adjacent_diff(array: list[T]) -> list[T]:
        # Courtesy of https://stackoverflow.com/questions/42868875
        return [(array[i] - array[i + 1]) for i in range(0, len(array) - 1)]

    @staticmethod
    def _get_adjacent_indices(
        docs_occur: DocumentOccurrencesType,
        n: int,
        calculate_adjacent_diff: Callable[[list[T]], T],
        get_consecutive_subsequences: Callable[[list[T], int], list[list[T]]],
    ) -> AdjacentIndicesType:
        """
        Get the indices of words that are adjacent in the given documents
        :param docs_occur: a dictionary mapping words indices to documents
        :param n: number of words to check against
        :return:
        """
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

    async def _get_words(self, words: list[str]) -> list[InvertedIndexItem]:
        results: list[InvertedIndexItem] = []

        for word in words:
            if item := await WordService(self._db).get_word(word):
                results.append(item)

        return results

    async def get_tokens(self, document: str, start: int, limit: int) -> TokensItem:
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

    async def get_phrase_indices(self, words: list[str]) -> dict[str, list[list[int]]]:
        """
        Find in what documents and where in particular given words appear together
        :param words: a list of words, i.e a phrase (e.g. "All that glisters is not gold")
        :return: a dictionary with document name as key and a list of indices as value
        """
        words_indices = self._get_words(words)
        results = [item.model_dump() for item in words_indices]  # Convert the pydantic models to Python dicts
        words_num = len(words) if isinstance(words, list) else 1

        common_docs = self._find_docs_intersection(attributes=results)
        document_occurrences: DocumentOccurrencesType = defaultdict(list)

        for result in results:
            for occurrence in result['occurrences']:
                document_occurrences[occurrence['document']].extend(
                    occurrence['indices'] if occurrence['document'] in common_docs else []
                )

        adjacent_indices = self._get_adjacent_indices(
            docs_occur=document_occurrences,
            n=words_num,
            calculate_adjacent_diff=self._calculate_adjacent_diff,
            get_consecutive_subsequences=self._get_consecutive_subsequences,
        )

        return adjacent_indices

    async def get_document(self, document: str) -> TokensItem:
        result = await self._db.bronzeTokens.find_one({"document": document})

        if result:
            return TokensItem(**result)


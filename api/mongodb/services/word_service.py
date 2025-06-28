import re

from pymongo import ASCENDING

from .repo_service import RepoService
from ..models import InvertedIndexItem, SuggestionsItem


class WordService(RepoService):

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

    async def find_matches(self, word: str) -> list[InvertedIndexItem]:
        """
        Find matches for a given word using mongo's built-in text search
        :param word: a textual representation of human sounds, what do you think it might be
        :return: a list of InvertedIndexItem objects containing the matches
        """
        results = await self._db.bronzeIndices \
            .find(
                {"$text": {"$search": word}},
                {"score": {"$meta": "textScore"}}
            ) \
            .sort("score", ASCENDING) \
            .to_list(None)

        if results:
            return results

    async def get_autosuggestions(self, q: str, limit: int) -> SuggestionsItem:
        pattern = re.escape(q)

        results = await self._db.bronzeIndices.find(
            {
                'word': {
                    '$regex': pattern,
                    '$options': 'i'
                },
            }, {'word': 1, '_id': 0,}
        ).limit(limit).to_list(None)

        suggestions = [result['word'] for result in results if 'word' in result]
 
        if results:
            return SuggestionsItem(suggestions=suggestions)


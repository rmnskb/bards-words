from typing import Optional

from .repo_service import RepoService
from ..models import DocumentFrequencyItem, YearFrequencyItem, CollocationsStatsItem


class StatsService(RepoService):

    async def get_year_freqs(self, word: str) -> Optional[YearFrequencyItem]:
        """
        Get statistics (frequencies per year) for a given word
        :param word: a word that you think Shakespeare might have used
        :return: freq per year per word
        """
        result = await self._db.goldWords.find_one(
            {"word": word},
            {"word": 1, "yearFrequencies": 1},
        )

        if not result:
            return None

        return YearFrequencyItem(**result)

    async def get_doc_freqs(self, word: str) -> Optional[DocumentFrequencyItem]:
        result = await self._db.goldWords.find_one(
            {"word": word},
            {"word": 1, "documentFrequencies": 1},
        )

        if not result:
            return None

        return DocumentFrequencyItem(**result)

    async def get_collocations_stats(self, word: str) -> Optional[CollocationsStatsItem]:
        result = await self._db.silverCollocationsStats.find_one({"word": word})

        if not result:
            return None

        return CollocationsStatsItem(**result)

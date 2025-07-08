from .repo_service import RepoService
from ..models import DocumentFrequencyItem, YearFrequencyItem, CollocationsStatsItem


class StatsService(RepoService):

    async def get_year_freqs(self, word: str) -> YearFrequencyItem:
        """
        Get statistics (frequencies per year) for a given word
        :param word: a word that you think Shakespeare might have used
        :return: freq per year per word
        """
        result = await self._db.goldWords.find_one(
            {"word": word},
            {"word": 1, "yearFrequencies": 1}
        )

        if result:
            return DocumentFrequencyItem(**result)

    async def get_doc_freqs(self, word: str) -> DocumentFrequencyItem:
        result = await self._db.goldWords.find_one(
            {"word": word},
            {"word": 1, "documentFrequencies": 1}
        )

        if result:
            return DocumentFrequencyItem(**result)

    async def get_collocations_stats(self, word: str) -> CollocationsStatsItem:
        result = await self._db.silverCollocationsStats.find_one({"word": word})

        if result:
            return CollocationsStatsItem(**result)

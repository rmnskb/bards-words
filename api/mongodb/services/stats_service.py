from .repo_service import RepoService
from ..models import WordDimensionsItem, CollocationsStatsItem


class StatsService(RepoService):

    async def get_stats(self, word: str) -> WordDimensionsItem:
        """
        Get statistics (frequencies per document or per year) for a given word
        :param word: a word that you think Shakespeare might have used
        :return: dimensions (freq per year, freq per document) per word
        """
        result = await self._db.goldWords.find_one({"word": word})

        if result:
            return WordDimensionsItem(**result)

    async def get_collocations_stats(self, word: str) -> CollocationsStatsItem:
        result = await self._db.silverCollocationsStats.find_one({"word": word})

        if result:
            return CollocationsStatsItem(**result)

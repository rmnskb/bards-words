from unittest.mock import MagicMock

import pytest
from bson import ObjectId

from api.mongodb.models import (
    CollocationsStatsItem,
    DocumentFrequencyItem,
    YearFrequencyItem,
)
from api.mongodb.services import StatsService


class TestStatsService:

    @pytest.fixture
    def stats_service(self, mock_db) -> StatsService:
        return StatsService(mock_db)

    @pytest.mark.asyncio
    async def test_get_year_freqs(
        self,
        stats_service: StatsService,
        mock_db: MagicMock,
    ) -> None:
        mock_result = {
            "_id": ObjectId(),
            "word": "thou",
            "yearFrequencies": [
                {"year": 1595, "frequency": 45},
                {"year": 1600, "frequency": 32},
            ],
        }

        mock_db.goldWords.find_one.return_value = mock_result

        result = await stats_service.get_year_freqs("thou")

        assert result is not None
        assert isinstance(result, YearFrequencyItem)
        mock_db.goldWords.find_one.assert_called_once_with(
            {"word": "thou"},
            {"word": 1, "yearFrequencies": 1},
        )

    @pytest.mark.asyncio
    async def test_get_doc_freqs(
        self,
        stats_service: StatsService,
        mock_db: MagicMock,
    ) -> None:
        mock_result = {
            "_id": ObjectId(),
            "word": "love",
            "documentFrequencies": [
                {"document": "Hamlet", "frequency": 12},
                {"document": "Cymbeline", "frequency": 34},
            ],
        }

        mock_db.goldWords.find_one.return_value = mock_result

        result = await stats_service.get_doc_freqs("love")

        assert result is not None
        assert isinstance(result, DocumentFrequencyItem)
        mock_db.goldWords.find_one.assert_called_once_with(
            {"word": "love"},
            {"word": 1, "documentFrequencies": 1},
        )

    @pytest.mark.asyncio
    async def test_get_collocations_stats(
        self,
        stats_service: StatsService,
        mock_db: MagicMock,
    ) -> None:
        mock_result = {
            "_id": ObjectId(),
            "word": "love",
            "collocationsStats": [
                {"other": "you", "frequency": 123},
                {"other": "life", "frequency": 456},
            ],
        }

        mock_db.silverCollocationsStats.find_one.return_value = mock_result

        result = await stats_service.get_collocations_stats("love")

        assert result is not None
        assert isinstance(result, CollocationsStatsItem)
        mock_db.silverCollocationsStats \
            .find_one.assert_called_once_with({"word": "love"})


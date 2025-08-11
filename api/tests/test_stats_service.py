import asyncio
from typing import Optional
from unittest.mock import AsyncMock, MagicMock

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
    def mock_db(self):
        db = MagicMock()
        db.goldWords = MagicMock()
        db.silverCollocationsStats = MagicMock()

        return db

    @pytest.fixture
    def stats_service(self, mock_db):
        return StatsService(mock_db)

    @pytest.mark.asyncio
    async def test_get_year_freqs_found(
        self,
        stats_service,
        mock_db,
    ):
        mock_result = {
            "_id": ObjectId('62a23958e5a9e9b88f853a67'),
            "word": "thou",
            "yearFrequencies": [
                {"year": 1595, "frequency": 45},
                {"year": 1600, "frequency": 32}
            ]
        }

        async def get_mock_result() -> dict[str, str | list[dict[str, int]]]:
            return mock_result

        mock_db.goldWords.find_one.return_value = get_mock_result()

        result = await stats_service.get_year_freqs("thou")

        assert result is not None
        assert isinstance(result, YearFrequencyItem)
        mock_db.goldWords.find_one.assert_called_once_with(
            {"word": "thou"},
            {"word": 1, "yearFrequencies": 1}
        )


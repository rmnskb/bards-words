from unittest.mock import MagicMock

import pytest

from api.mongodb.models import (
    CollocationsStatsItem,
    DocumentFrequencyItem,
    YearFrequencyItem,
)
from api.mongodb.services import StatsService
from api.tests.test_services.base_service_test import BaseServiceTest


class TestStatsService(BaseServiceTest):

    @pytest.fixture
    def stats_service(self, mock_db) -> StatsService:
        return StatsService(mock_db)

    @pytest.fixture
    def year_freq_data(self) -> list[dict[str, int]]:
        return [
            {"year": 1595, "frequency": 45},
            {"year": 1600, "frequency": 32},
        ]

    @pytest.fixture
    def doc_freq_data(self) -> list[dict[str, int | str]]:
        return [
            {"document": "Hamlet", "frequency": 12},
            {"document": "Cymbeline", "frequency": 34},
        ]

    @pytest.fixture
    def collocations_stats(self) -> list[dict[str, int | str]]:
        return [
            {"other": "you", "frequency": 123},
            {"other": "life", "frequency": 456},
        ]

    @pytest.mark.asyncio
    @pytest.mark.parametrize("word", ["love", "thou", ""])
    async def test_get_year_freqs(
        self,
        stats_service: StatsService,
        mock_db: MagicMock,
        year_freq_data: list[dict[str, int]],
        word: str,
    ) -> None:
        mock_result = self._create_mock_result(
            word=word,
            yearFrequencies=year_freq_data,
        )

        result = await self._setup_mock_and_test(
            collection=mock_db.goldWords,
            method=stats_service.get_year_freqs,
            method_args={"word": word},
            expected_model=YearFrequencyItem,
            expected_query=[
                {"word": word},
                {"word": 1, "yearFrequencies": 1},
            ],
            mock_result=mock_result,
        )

        assert result is not None
        assert result.word == word
        assert len(result.yearFrequencies) == 2

    @pytest.mark.asyncio
    @pytest.mark.parametrize("word", ["love", "thou", ""])
    async def test_get_doc_freqs(
        self,
        stats_service: StatsService,
        mock_db: MagicMock,
        doc_freq_data: list[dict[str, str | int]],
        word: str,
    ) -> None:
        mock_result = self._create_mock_result(
            word=word,
            documentFrequencies=doc_freq_data,
        )

        result = await self._setup_mock_and_test(
            collection=mock_db.goldWords,
            method=stats_service.get_doc_freqs,
            method_args={"word": word},
            expected_model=DocumentFrequencyItem,
            expected_query=[
                {"word": word},
                {"word": 1, "documentFrequencies": 1},
            ],
            mock_result=mock_result,
        )

        assert result is not None
        assert result.word == word
        assert len(result.documentFrequencies) == 2

    @pytest.mark.asyncio
    @pytest.mark.parametrize("word", ["love", "thou", ""])
    async def test_get_collocations_stats(
        self,
        stats_service: StatsService,
        mock_db: MagicMock,
        collocations_stats: list[dict[str, str | int]],
        word: str,
    ) -> None:
        mock_result = self._create_mock_result(
            word=word,
            collocationsStats=collocations_stats,
        )

        result = await self._setup_mock_and_test(
            collection=mock_db.silverCollocationsStats,
            method=stats_service.get_collocations_stats,
            method_args={"word": word},
            expected_model=CollocationsStatsItem,
            expected_query=[{"word": word}],
            mock_result=mock_result,
        )

        assert result is not None
        assert result.word == word
        assert len(result.collocationsStats) == 2

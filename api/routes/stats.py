from fastapi import APIRouter, Depends

from api.mongodb import ShakespeareRepository
from api.mongodb.models import DocumentFrequencyItem, YearFrequencyItem, CollocationsStatsItem
from api.mongodb.services import StatsService
from api.utils import require_param, validate_response


db = ShakespeareRepository().db
stats_route = APIRouter(prefix='/api/v1/stats')


@stats_route.get('/documents')
async def get_doc_freqs(
        word: str = Depends(require_param)) -> DocumentFrequencyItem:
    return await validate_response(
        StatsService(db).get_doc_freqs,
        word,
    )


@stats_route.get('/years')
async def get_year_freqs(
        word: str = Depends(require_param)) -> YearFrequencyItem:
    return await validate_response(
        StatsService(db).get_year_freqs,
        word,
    )


@stats_route.get('/collocations')
async def get_collocations_stats(
        search: str = Depends(require_param)) -> CollocationsStatsItem:
    return await validate_response(
        StatsService(db).get_collocations_stats,
        search,
    )

from fastapi import APIRouter, Query, HTTPException

from api.mongodb import ShakespeareRepository
from api.mongodb.models import DocumentFrequencyItem, YearFrequencyItem, CollocationsStatsItem
from api.mongodb.services import StatsService


db = ShakespeareRepository().db

stats_route = APIRouter(prefix='/api/v1/stats')


@stats_route.get('/documents')
async def get_doc_freqs(word: str = Query(None)) -> DocumentFrequencyItem:
    if word is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await StatsService(db).get_doc_freqs(word)


@stats_route.get('/years')
async def get_year_freqs(word: str = Query(None)) -> YearFrequencyItem:
    if word is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await StatsService(db).get_year_freqs(word)



@stats_route.get('/collocations')
async def get_collocations_stats(search: str = Query(None)) -> CollocationsStatsItem:
    if search is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await StatsService(db).get_collocations_stats(search)


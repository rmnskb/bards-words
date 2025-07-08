from typing import Optional
from datetime import datetime

from fastapi import APIRouter, Query, HTTPException

from api.mongodb import ShakespeareRepository
from api.mongodb.models import (
    InvertedIndexItem, SuggestionsItem,
    WordOfTheDayItem, EligibleWordsItem,
)
from api.mongodb.services import WordService, WordleService


db = ShakespeareRepository().db

words_route = APIRouter(prefix='/api/v1/words')


@words_route.get('/')
async def get_word(search: str = Query(None)) -> InvertedIndexItem:
    if not search:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await WordService(db).get_word(search)


@words_route.get('/matches')
async def get_matches(search: str = Query(None)) -> list[InvertedIndexItem]:
    if search is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await WordService(db).get_matches(search)


@words_route.get('/suggestions')
async def get_autosuggestions(q: str = Query(None), limit: int = Query(None)) -> SuggestionsItem:
    if q is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await WordService(db).get_autosuggestions(q=q, limit=limit)


@words_route.get('/random')
async def get_random_word(
    date: Optional[str] = Query(None),
    word_length: Optional[int] = Query(None)
) -> WordOfTheDayItem:
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d").date() if date else None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {e}. Use YYYY-mm-dd")

    return await WordleService(db).get_random_word(target_date=target_date, length=word_length)


@words_route.get('/eligible')
async def get_eligible_words(word_length: int = Query(None)) -> EligibleWordsItem:
    if word_length is None:
        raise HTTPException(status_code=400, detail='word_length parameter is required')

    return await WordleService(db).get_eligible_words(word_length)


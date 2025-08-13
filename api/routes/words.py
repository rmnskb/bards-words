from datetime import datetime
from typing import Optional, Annotated

from fastapi import APIRouter, HTTPException, Query
from pydantic import AfterValidator

from api.mongodb import ShakespeareRepository
from api.mongodb.models import (
    EligibleWordsItem,
    InvertedIndexItem,
    SuggestionsItem,
    WordOfTheDayItem,
)
from api.mongodb.services import WordleService, WordService
from api.utils import require_param, validate_response

db = ShakespeareRepository().db

words_route = APIRouter(prefix='/api/v1/words')


@words_route.get('/')
async def get_word(
    search: Annotated[str, AfterValidator(require_param)],
) -> InvertedIndexItem:
    return await validate_response(
        WordService(db).get_word,
        search,
    )

@words_route.get('/matches')
async def get_matches(
    search: Annotated[str, AfterValidator(require_param)],
) -> list[InvertedIndexItem]:
    return await validate_response(
        WordService(db).get_matches,
        search,
    )


@words_route.get('/suggestions')
async def get_autosuggestions(
    q: Annotated[str, AfterValidator(require_param)],
    limit: Annotated[int, AfterValidator(require_param)],
) -> SuggestionsItem:
    return await validate_response(
        WordService(db).get_autosuggestions,
        q, limit,
    )


@words_route.get('/random')
async def get_random_word(
    date: Optional[str] = Query(None),
    word_length: Optional[int] = Query(None),
) -> WordOfTheDayItem:
    try:
        target_date = datetime.strptime(date, "%Y-%m-%d").date() if date else None
    except ValueError as e:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {e}. Use YYYY-mm-dd")

    return await validate_response(
        WordleService(db).get_random_word,
        target_date, word_length,
    )


@words_route.get('/eligible')
async def get_eligible_words(
    word_length: Annotated[int, AfterValidator(require_param)],
) -> EligibleWordsItem:
    return await validate_response(
        WordleService(db).get_eligible_words,
        word_length,
    )

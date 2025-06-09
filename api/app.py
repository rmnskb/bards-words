from contextlib import asynccontextmanager

from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.mongodb import (
    ShakespeareRepository, InvertedIndexItem, 
    TokensItem, WordDimensionsItem, CollocationsStatsItem, SuggestionsItem
)
from .enums import ShakespeareWork


repo = ShakespeareRepository()


@asynccontextmanager
async def lifespan(app: FastAPI) -> None:
    await repo.create_indices()
    yield


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['GET'],
    allow_headers=["*"],
)


@app.get('/api/v1')
async def index() -> dict[str, str]:
    return {'name': 'Shakespeare API'}


@app.get('/api/v1/health')
async def health() -> dict[str, str]:
    return {'status': 'healthy'}


@app.get('/api/v1/word')
async def find_one(search: str = Query(None)) -> InvertedIndexItem:
    if not search:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_word(search)


@app.get('/api/v1/words')
async def find_many(search: list[str] = Query(None)) -> list[InvertedIndexItem]:
    if not search:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_words(search)


@app.get('/api/v1/tokens')
async def get_tokens(document: str = Query(None), start: int = Query(None), end: int = Query(None)) -> TokensItem:
    if document is None or start is None or end is None:
        raise HTTPException(status_code=400, detail='All query parameters (work, start, end) are required')
    elif start > end:
        raise HTTPException(status_code=400, detail='Start index is greater than end index')

    limit = end - start
    document = str(ShakespeareWork[document])

    return await repo.find_tokens(document, start, limit)


@app.get('/api/v1/phrase')
async def find_phrase(words: list[str] = Query(None)) -> list[TokensItem]:
    if words is None or len(words) == 0:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    document_indices: dict[str, list[list[int]]] = await repo.find_phrase_indices(words)
    phrases: list[TokensItem] = []

    for document, indices in document_indices.items():
        for sequence in indices:
            start = min(sequence)
            limit = len(sequence)
            phrase_tokens = await repo.find_tokens(document=document, start=start - 10, limit=limit + 15)
            phrases.append(phrase_tokens)

    return phrases


@app.get('/api/v1/matches')
async def find_matches(search: str = Query(None)) -> list[InvertedIndexItem]:
    if search is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_matches(search)


@app.get('/api/v1/stats')
async def get_stats(word: str = Query(None)) -> WordDimensionsItem:
    if word is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.get_stats(word)


@app.get('/api/v1/document')
async def get_document(search: str = Query(None)) -> TokensItem:
    if search is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    document = str(ShakespeareWork[search])

    return await repo.get_document(document)


@app.get('/api/v1/collocations')
async def get_collocations_stats(search: str = Query(None)) -> CollocationsStatsItem:
    if search is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.get_collocations_stats(search)


@app.get('/api/v1/suggestions')
async def get_autosuggestions(q: str = Query(None), limit: int = Query(None)) -> SuggestionsItem:
    if q is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')
    return await repo.get_autosuggestions(q=q, limit=limit)


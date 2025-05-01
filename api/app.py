from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from api.mongodb import ShakespeareRepository, InvertedIndexItem, TokensItem
from .enums import ShakespeareWork

# TODO: handle empty responses either in the api or in the repo
app = FastAPI()
repo = ShakespeareRepository()

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


@app.get('/api/v1/find-one')
async def find_one(word: str = Query(None)) -> InvertedIndexItem:
    if not word:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_word(word)


@app.get('/api/v1/find-many')
async def find_many(words: list[str] = Query(None)) -> list[InvertedIndexItem]:
    if not words:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_words(words)


@app.get('/api/v1/get-tokens')
async def get_tokens(work: str = Query(None), start: int = Query(None), end: int = Query(None)) -> TokensItem:
    if work is None or start is None or end is None:
        raise HTTPException(status_code=400, detail='All query parameters (work, start, end) are required')
    elif start > end:
        raise HTTPException(status_code=400, detail='Start index is greater than end index')

    limit = end - start
    work = str(ShakespeareWork[work])

    return await repo.find_tokens(work, start, limit)


@app.get('/api/v1/find-phrase')
async def find_phrase(words: list[str] = Query(None)):
    if words is None or len(words) == 0:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    document_indices: dict[str, list[list[int]]] = await repo.find_phrase_indices(words)
    phrases: list[dict[str, list[str]]] = []

    for document, indices in document_indices.items():
        for sequence in indices:
            start = min(sequence)
            limit = len(sequence)
            phrase_tokens = await repo.find_tokens(document=document, start=start - 1, limit=limit + 3)
            phrases.append(phrase_tokens.model_dump())

    return phrases


@app.get('/api/v1/find-matches')
async def find_matches(word: str = Query(None)) -> list[InvertedIndexItem]:
    if word is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_matches(word)

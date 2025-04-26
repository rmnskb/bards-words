from fastapi import FastAPI, Query, HTTPException

from api.mongodb import ShakespeareRepository, InvertedIndexItem, TokensItem
from .enums import ShakespeareWork

app = FastAPI()
repo = ShakespeareRepository()


@app.get('/')
async def index():
    return {'message': 'Hello World'}


@app.get('/find-one')
async def find_one(word: str = Query(None)) -> InvertedIndexItem:
    if not word:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_word(word)


@app.get('/find-many')
async def find_many(words: list[str] = Query(None)) -> list[InvertedIndexItem]:
    if not words:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_words(words)


@app.get('/get-tokens')
async def get_tokens(work: str = Query(None), start: int = Query(None), end: int = Query(None)) -> TokensItem:
    if work is None or start is None or end is None:
        raise HTTPException(status_code=400, detail='All query parameters (work, start, end) are required')
    elif start > end:
        raise HTTPException(status_code=400, detail='Start index is greater than end index')

    limit = end - start
    work = str(ShakespeareWork[work])

    return await repo.find_tokens(work, start, limit)


@app.get('/find-phrase')
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

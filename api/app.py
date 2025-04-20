from fastapi import FastAPI, Query, HTTPException

from api.mongodb import ShakespeareRepository, InvertedIndexItem, TokensItem
from .enums import ShakespeareWork

app = FastAPI()
repo = ShakespeareRepository()


@app.get('/')
async def index():
    return {'message': 'Hello World'}


@app.get('/find-one')
async def find_word(word: str = Query(None)) -> InvertedIndexItem:
    if not word:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_word(word)


@app.get('/find-many')
async def find_many(words: list[str] = Query(None)):
    if not words:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    return await repo.find_words(words)


@app.get('/get-tokens')
async def get_tokens(work: str = Query(None), start: int = Query(None), end: int = Query(None)) -> TokensItem:
    raise NotImplementedError

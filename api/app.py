import json

from fastapi import FastAPI

from api.mongodb import ShakespeareRepository, InvertedIndexItem

app = FastAPI()
repo = ShakespeareRepository()


@app.get('/')
async def index():
    return {'message': 'Hello World'}


@app.get('/find/{word}')
async def find(word: str):
    result: InvertedIndexItem = await repo.find_word(word)

    return result

from fastapi import FastAPI

app = FastAPI()


@app.get('/')
async def index():
    return {'message': 'Hello World'}


@app.get('/find/{word}')
async def find(word: str):
    return {'word': word}

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.mongodb import ShakespeareRepository
from api.routes import words_route, stats_route, tokens_route


repo = ShakespeareRepository()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await repo.create_indices()
    yield


app = FastAPI(
    title='Shakespeare API',
    version='1.0.0',
    docs_url='/api/v1/docs',
    lifespan=lifespan,
)

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


app.include_router(words_route)
app.include_router(stats_route)
app.include_router(tokens_route)


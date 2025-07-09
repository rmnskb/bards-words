from fastapi import APIRouter, Query, HTTPException

from api.mongodb import ShakespeareRepository
from api.mongodb.models import TokensItem
from api.mongodb.services import TokensService, AdjacentIndicesType

from api.enums import ShakespeareWork


db = ShakespeareRepository().db

tokens_route = APIRouter(prefix='/api/v1/tokens')

@tokens_route.get('/')
async def get_tokens(
    document: str = Query(None),
    start: int = Query(None),
    end: int = Query(None)
) -> TokensItem:
    if document is None or start is None or end is None:
        raise HTTPException(status_code=400, detail='All query parameters (work, start, end) are required')
    elif start > end:
        raise HTTPException(status_code=400, detail='Start index is greater than end index')

    limit = end - start
    document = str(ShakespeareWork[document])

    return await TokensService(db).get_tokens(document, start, limit)


@tokens_route.get('/phrase')
async def get_phrase(words: list[str] = Query(None)) -> list[TokensItem]:
    if words is None or len(words) == 0:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    document_indices: AdjacentIndicesType = await TokensService(db).get_phrase_indices(words)
    phrases: list[TokensItem] = []

    for document, indices in document_indices.items():
        for sequence in indices:
            start = min(sequence)
            limit = len(sequence)
            phrase_tokens = await TokensService(db).find_tokens(document=document, start=start - 10, limit=limit + 15)
            phrases.append(phrase_tokens)

    return phrases


# TODO: Implement paginating and caching
@tokens_route.get('/document')
async def get_document(search: str = Query(None)) -> TokensItem:
    if search is None:
        raise HTTPException(status_code=400, detail='Query parameter is required')

    document = str(ShakespeareWork[search])

    return await TokensService(db).get_document(document)


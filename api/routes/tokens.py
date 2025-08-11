from fastapi import APIRouter, Depends, HTTPException

from api.enums import ShakespeareWork
from api.mongodb import ShakespeareRepository
from api.mongodb.models import TokensItem
from api.mongodb.services import AdjacentIndicesType, TokensService
from api.utils import require_param, validate_response

db = ShakespeareRepository().db
tokens_route = APIRouter(prefix='/api/v1/tokens')


@tokens_route.get('/')
async def get_tokens(
    document: str = Depends(require_param),
    start: int = Depends(require_param),
    end: int = Depends(require_param),
) -> TokensItem:
    if start > end:
        raise HTTPException(status_code=400, detail='Start index is greater than end index')

    limit = end - start
    document = str(ShakespeareWork[document])

    return await validate_response(
        TokensService(db).get_tokens,
        document, start, limit,
    )

@tokens_route.get('/phrase')
async def get_phrase(
        words: list[str] = Depends(require_param)) -> list[TokensItem]:
    document_indices: AdjacentIndicesType = await TokensService(db).get_phrase_indices(words)
    phrases: list[TokensItem] = []

    for document, indices in document_indices.items():
        for sequence in indices:
            start = min(sequence) - 10
            limit = len(sequence) + 15
            phrase_tokens = await validate_response(
                TokensService(db).get_tokens,
                document, start, limit,
            )
            phrases.append(phrase_tokens)

    return phrases


# TODO: Implement paginating and caching
@tokens_route.get('/document')
async def get_document(search: str = Depends(require_param)) -> TokensItem:
    document = str(ShakespeareWork[search])

    return await validate_response(
        TokensService(db).get_document,
        document,
    )

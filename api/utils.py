from typing import Any, Awaitable, Callable, Optional, TypeVar

from fastapi import HTTPException, Query

T = TypeVar('T')


def require_param(q: Optional[T] = Query(None)) -> T:
    if not q or (isinstance(q, str) and not q.strip()):
        raise HTTPException(status_code=400, detail="Query parameter is required")

    return q


async def validate_response(
    func: Callable[[Any], Awaitable[Optional[T]]],
    *args: Any,
    err_msg = 'Resource not found',
) -> T:
    result = await func(*args)

    if not result:
        raise HTTPException(status_code=404, detail=err_msg)

    return result

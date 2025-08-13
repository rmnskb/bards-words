from typing import Any, Awaitable, Callable, Optional, TypeVar

from fastapi import HTTPException, Query

T = TypeVar('T')
type ParamInput = str | int | list[Any]


def require_param(q: Optional[ParamInput] = Query(None)) -> ParamInput:
    str_check = (isinstance(q, str) and not q.strip())
    int_check = (isinstance(q, int) and q < 0)
    list_check = (isinstance(q, list) and not q)

    if str_check or int_check or list_check or q is None:
        raise HTTPException(status_code=400, detail="Query parameter is required")

    return q


async def validate_response(
    func: Callable[..., Awaitable[Optional[T]]],
    *args: Any,
    err_msg = 'Resource not found',
) -> T:
    result = await func(*args)

    if not result:
        raise HTTPException(status_code=404, detail=err_msg)

    return result

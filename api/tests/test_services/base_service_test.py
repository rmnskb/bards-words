from typing import Any, Awaitable, Callable, Optional, Type
from unittest.mock import AsyncMock

from bson import ObjectId


class BaseServiceTest:

    def _create_mock_result(
        self,
        word: str,
        **kwargs: Any,
    ) -> dict[str, Any]:
        return {
            "_id": ObjectId(),
            "word": word,
            **kwargs,
        }

    async def _setup_mock_and_test[T](
        self,
        collection: AsyncMock,
        method: Callable[..., Awaitable[T]],
        method_args: dict[str, Any],
        expected_model: Type[T],
        expected_query: Optional[list[dict[str, Any]]],
        mock_result: dict[str, Any],
    ) -> T:
        collection.find_one.return_value = mock_result

        result = await method(**method_args)

        assert result is not None
        assert isinstance(result, expected_model)

        expected_query = expected_query or [{"word": method_args.get("word", "")}]
        collection.find_one.assert_called_once_with(*expected_query)

        return result

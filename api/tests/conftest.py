import pytest
from unittest.mock import AsyncMock, MagicMock


@pytest.fixture
def mock_db() -> MagicMock:
    db = MagicMock()

    for collection_name in [
        "goldWords",
        "silverCollocationsStats",
    ]:
        collection = MagicMock()
        collection.find_one = AsyncMock()
        collection.find = AsyncMock()
        setattr(db, collection_name, collection)

    return db

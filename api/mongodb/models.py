from pydantic import BaseModel, Field
from bson import ObjectId


class MongoQueryResult(BaseModel):
    id: ObjectId = Field(None, exclude=True, alias="_id")

    class Config:
        arbitrary_types_allowed = True


class TokensItem(MongoQueryResult):
    document: str
    occurrences: list[str]


class _OccurrenceElement(BaseModel):
    document: str
    frequency: int
    indices: list[int]


class InvertedIndexItem(MongoQueryResult):
    word: str
    occurrences: list[_OccurrenceElement]


class NormalisedIndexItem(MongoQueryResult):
    word: str
    document: str
    frequency: int
    positionIdx: int

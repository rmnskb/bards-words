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


class _DocumentFrequencyElement(BaseModel):
    document: str
    frequency: int


class _YearFrequencyElement(BaseModel):
    year: str
    frequency: int


class WordDimensionsItem(MongoQueryResult):
    word: str
    documentFrequencies: list[_DocumentFrequencyElement]
    yearFrequencies: list[_YearFrequencyElement]

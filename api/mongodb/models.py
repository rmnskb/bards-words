from pydantic import BaseModel, Field
from bson import ObjectId


class MongoQueryResult(BaseModel):
    id: ObjectId = Field(None, exclude=True, alias="_id")

    class Config:
        arbitrary_types_allowed = True


class TokensItem(MongoQueryResult):
    document: str
    occurrences: list[str]


class InvertedIndexItem(MongoQueryResult):
    class _OccurrenceElement(BaseModel):
        document: str
        frequency: int
        indices: list[int]

    word: str
    occurrences: list[_OccurrenceElement]


class NormalisedIndexItem(MongoQueryResult):
    word: str
    document: str
    frequency: int
    positionIdx: int


class WordDimensionsItem(MongoQueryResult):
    class _DocumentFrequencyElement(BaseModel):
        document: str
        frequency: int

    class _YearFrequencyElement(BaseModel):
        year: int
        frequency: int

    word: str
    documentFrequencies: list[_DocumentFrequencyElement]
    yearFrequencies: list[_YearFrequencyElement]


class CollocationsStatsItem(MongoQueryResult):
    class _LinkItem(BaseModel):
        other: str  # Defines a link to this node
        frequency: int  # Defines the size of the node

    word: str
    collocationsStats: list[_LinkItem]

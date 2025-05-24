from typing import Any

from pyspark.sql.types import StructType, StructField, ArrayType, StringType, IntegerType


class SparkSchema:
    _schema: StructType

    @classmethod
    def get(cls):
        return cls._schema

    @classmethod
    def to_dict(cls) -> dict[str, Any]:
        return cls._schema.jsonValue()

    @classmethod
    def equals(cls, other: StructType) -> bool:
        # Faulty implementation atm, since inferred schemas are different
        # in their metadata, as opposed to manually created
        return cls.to_dict() == other.jsonValue()


class TokensSchema(SparkSchema):
    _schema = StructType([
        StructField('document', StringType())
        , StructField('occurrences', ArrayType(StringType()))
    ])


class IndexedTokensSchema(SparkSchema): 
    _schema = StructType([
        StructField('document', StringType())
        , StructField('word', StringType())
        , StructField('index', IntegerType())
    ])


class InvertedIndexSchema(SparkSchema):
    _schema = StructType([
        StructField('word', StringType(), False)
        , StructField('occurrences', ArrayType(
            StructType([
                StructField('document', StringType(), False)
                , StructField('frequency', IntegerType(), False)
                , StructField('indices', ArrayType(
                    IntegerType(), False
                ), False)
            ])
        ), False)
    ])


class NormalisedIndexSchema(SparkSchema):
    _schema = StructType([
        StructField('word', StringType(), True)
        , StructField('document', StringType(), True)
        , StructField('frequency', IntegerType(), True)
        , StructField('positionIdx', IntegerType(), True)
    ])


class WordDimensionsFrequencies(SparkSchema):
    _schema = StructType([
        StructField('word', StringType(), False)
        , StructField('documentFrequencies', ArrayType(
            StructType([
                StructField('document', StringType(), False)
                , StructField('frequency', IntegerType(), False)
            ])
        ), False)
        , StructField('yearFrequencies', ArrayType(
            StructType([
                StructField('year', StringType(), False)
                , StructField('frequency', IntegerType(), False)
            ])
        ), False)
    ])


class CollocationsStatsSchema(SparkSchema):
    _schema = StructType([
        StructField('word', StringType(), False)
        , StructField('collocationsStats', ArrayType(
            StructType([
                StructField('other', StringType(), False)
                , StructField('frequency', IntegerType(), False)
            ])
        ), False)
    ])


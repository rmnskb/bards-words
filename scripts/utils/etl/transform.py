import re
from typing import TypeAlias, Literal, overload

from pyspark import SparkContext, RDD
from pyspark.sql import DataFrame
from pyspark.sql.functions import col, explode, broadcast, struct, collect_list
from pyspark.sql.types import IntegerType
from stop_words import get_stop_words

DocumentTextType: TypeAlias = tuple[str, str]
DocumentTokensType: TypeAlias = tuple[str, list[str]]
DocumentIndexedTokensType: TypeAlias = tuple[tuple[str, str], list[int]]
DocumentFlatIndexedTokensType: TypeAlias = tuple[str, str, int]
NameLinesType: TypeAlias = tuple[str, list[str, str]]
WordDocumentType: TypeAlias = tuple[str, str]
InvertedIndexType: TypeAlias = tuple[str, list[tuple[str, int, list[int]]]]


# TODO: Add another transformation to separate by sentences for sentiment analysis purposes
# TODO: Enable the collocation analysis
class BronzeDataTransformer:
    """
    This class handles the actual data transformations in a functional manner.
    Takes SparkContext object as a constructor argument.
    """

    def __init__(self, sc: SparkContext):
        # Broadcast all the stop words across worker nodes
        self._stopwords_broadcast = sc.broadcast(set(get_stop_words('english')))

    @overload
    def transform(
            self
            , to: Literal['tokens']
            , data: RDD[DocumentTextType]
    ) -> RDD[DocumentTokensType]:
        ...

    @overload
    def transform(
        self
        , to: Literal['indexed_tokens']
        , data: RDD[DocumentTokensType]
    ) -> RDD[DocumentFlatIndexedTokensType]:
        ...

    @overload
    def transform(
            self
            , to: Literal['inverted_index']
            , data: RDD[DocumentTokensType]
    ) -> RDD[InvertedIndexType]:
        ...

    def transform(
            self
            , to: Literal['tokens', 'indexed_tokens', 'inverted_index']
            , data: RDD[DocumentTextType | DocumentTokensType]
    ) -> RDD[DocumentTokensType | DocumentFlatIndexedTokensType | InvertedIndexType]:
        """
        Conduct data transformation step (RDD -> RDD)
        :param to: to what type of data structure do your want you data to be converted to,
            either 'tokens' or 'inverted-index'
        :param data: takes as an input either RDD in (document, text) format to process it to tokens
            or RDD in (document, array of tokens) format to create an inverted index data structure out of it
        :return: either tokens or inverted-index RDDs
        """
        match to:
            case 'tokens':
                return self._transform_text_to_tokens(data=data)
            case 'indexed_tokens':
                return self._flatten_indexed_tokens(data=data)
            case 'inverted_index':
                return self._transform_tokens_to_inverted_idx(data=data)
            case _:
                raise ValueError(f'Invalid transformation target: {to}')

    def _transform_text_to_tokens(self, data: RDD[DocumentTextType]) -> RDD[DocumentTokensType]:
        """
        Tokenise the .txt file
        :param data: RDD with the document name and text as tuples
        :return: tokenised .txt file
        """
        return (
            data
            # Take the name of the document from the 1st line in the .txt
            .map(lambda entry: (self._beautify(entry[1][:50]), entry[1]))  # => RDD[tuple[str, str]]
            .map(self._tokenise)  # => RDD[tuple[str, list[str]]]
        )

    def _transform_tokens_to_indexed_tokens(self, data: RDD[DocumentTokensType]) -> RDD[DocumentIndexedTokensType]:
        return (
            data
            .flatMap(self._create_index_pairs)  # => RDD[list[tuple[tuple[str, str], list[int]]]]
            .map(lambda entry: ((entry[0][0], entry[0][1].strip()), entry[1]))
            .map(lambda entry: ((entry[0][0], entry[0][1].lower()), entry[1]))
            .map(lambda entry: ((entry[0][0], self._remove_punctuation(entry[0][1])), entry[1]))
            .map(lambda entry: ((entry[0][0], self._remove_suffix(entry[0][1])), entry[1]))
            .filter(lambda entry: bool(entry[0][1]))  # check if the word is not an empty string
        )

    def _flatten_indexed_tokens(self, data: RDD[DocumentTokensType]) -> RDD[DocumentFlatIndexedTokensType]:
        """
        Flatten the indices (since there is 1 element per list it is a simple list -> integer transformation)
        """
        return (
            self._transform_tokens_to_indexed_tokens(data)
            .map(lambda entry: (entry[0][0], entry[0][1], entry[1][0]))
        )

    def _transform_tokens_to_inverted_idx(self, data: RDD[DocumentTokensType]) -> RDD[InvertedIndexType]:
        """
        Transform a tokenised array to an inverted index data structure,
        where a word acts as a key, and points to a list of occurrences in the given documents,
        with respective occurrences' indices and total frequency.
        :param data: RDD with the document name and an array of tokens
        :return: inverted index data structure
        """
        return (
            self._transform_tokens_to_indexed_tokens(data)
            # Concatenate the lists of indices
            .reduceByKey(lambda x, y: x + y)  # => RDD[tuple[str, str], list[int]]
            # Restructure the entry, calculate the word frequency in the document
            .map(
                lambda entry:
                (entry[0][1], (entry[0][0], len(entry[1]), entry[1]))
            )  # => RDD[tuple[str, tuple[str, int, list[int]]]]
            # Group by words and put the occurrences in different documents to an array
            .groupByKey()
            .mapValues(lambda values: list(values))  # => RDD[tuple[str, list[tuple[str, int, list[int]]]]]
        )

    @staticmethod
    def _tokenise(entry: DocumentTextType) -> DocumentTokensType:
        name: str = entry[0]
        text: str = entry[1]

        marked_text: str = text.replace('\n', '\n\n')

        tokens: list[str] = re.split(r'\s', marked_text)

        return name, tokens

    @staticmethod
    def _beautify(name: str) -> str:
        """
        The general pattern of the .txt files is that they start with the name of the play
        This function exploits this pattern with RegEx
        :param name: string with the play's beginning
        :return: the matched name
        """
        return re.match(r'^.*?(?=\n)', name)[0]

    @staticmethod
    def _remove_punctuation(word: str) -> str:
        """Remove all special characters from a word:"""
        return re.sub(r'[\W_]*', '', word)

    @staticmethod
    def _remove_suffix(word: str) -> str:
        """Remove the suffix from a string, naive implementation"""
        return re.sub(r'(ing|ed|ly)$', '', word.strip())

    def _is_stopword(self, word: str) -> bool:
        """Check whether the word is a stop-word"""
        # Due to Spark's nature, you have to create a local copy of instance variable
        stopwords_broadcast = self._stopwords_broadcast

        stop_words = stopwords_broadcast.value

        return word.lower() in stop_words

    @staticmethod
    def _create_index_pairs(entry: DocumentTokensType) -> list[DocumentIndexedTokensType]:
        """
        Create a data structure where each word in the document is indexed with its
        absolute position in the document.
        The (document, word) pair acts as a unique identifier for future reduction transformation
        :param entry: a document: tokens tuple
        :return: a list of (document, word): [index] pairs
        """
        document = entry[0]
        words = entry[1]

        return [((document, word), [idx]) for idx, word in enumerate(words)]


class SilverDataTransformer:

    @staticmethod
    def transform(data: DataFrame) -> DataFrame:
        return (
            data
            .select(col('word'), explode(col('occurrences')).alias('occurrences'))  # Flatten the array of occurrences
            .select(  # Flatten the struct with three fields inside, retain only document and the freq in it
                col('word')
                , col("occurrences").getField("document").alias("document")
                , col("occurrences").getField("frequency").alias("frequency")
            )
        )


class GoldDataTransformer:

    @classmethod
    def transform(cls, words: DataFrame, chronology: DataFrame) -> DataFrame:
        joined_df = (
            words
            .join(broadcast(chronology), on='document', how='left')
        )

        distinct_words = words.select(col('word')).distinct()
        doc_freq = cls._get_freq_per_dimension(df=joined_df, dimension='document')
        year_freq = cls._get_freq_per_dimension(df=joined_df, dimension='year')

        return (
            distinct_words
            .join(doc_freq, on='word', how='left')
            .join(year_freq, on='word', how='left')
        )

    @staticmethod
    def _get_freq_per_dimension(df: DataFrame, dimension: Literal['document', 'year']) -> DataFrame:
        return (
            df
            .groupBy([col('word'), col(dimension)])
            .agg(
                {'frequency': 'sum'}
            )
            .select(col('word'), col(dimension), col('sum(frequency)').cast(IntegerType()).alias('frequency'))
            .select(col('word'), struct(col(dimension), col('frequency')).alias(f'{dimension}_freq'))
            .groupBy(col('word'))
            # Implode the struct, so there is only one array entry per word
            .agg(collect_list(col(f'{dimension}_freq')).alias(f'{dimension}Frequencies'))
        )

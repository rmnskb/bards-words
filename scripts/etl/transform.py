import re
from typing import TypeAlias

from pyspark import SparkContext, RDD
from stop_words import get_stop_words

DocumentTextType: TypeAlias = tuple[str, str]
NameLinesType: TypeAlias = tuple[str, list[str, str]]
WordDocumentType: TypeAlias = tuple[str, str]
InvertedIndexType: TypeAlias = tuple[str, list[tuple[str, int]]]


class DataTransformer:
    """
    This class handles the actual data transformations in a functional manner.
    Takes SparkContext object as a constructor argument.
    """

    def __init__(self, spark: SparkContext):
        self._stopwords_broadcast = spark.broadcast(set(get_stop_words('english')))

    def transform(self, data: RDD[DocumentTextType]) -> RDD[InvertedIndexType]:
        return (
            data
            # Take the name of the document from the 1st line in the .txt
            .map(lambda entry: (self._beautify(entry[1][:50]), entry[1]))  # => RDD[tuple[str, str]]
            # Divide the .txt content by lines
            .map(lambda entry: (entry[0], entry[1].splitlines()))  # => RDD[tuple[str, list[str]]]
            # Tokenise the lines
            .flatMap(self._create_pairs)  # => RDD[tuple[str, str]]
            .filter(lambda entry: not self._is_stopword(entry[0]))
            .map(lambda entry: (self._remove_suffix(entry[0]), entry[1]))
            # Add frequency to the entry
            .map(lambda entry: (entry, 1))  # => RDD[tuple[tuple[str, str], int]]
            # Count the number of word occurrences
            .reduceByKey(lambda x, y: x + y)
            # Restructure the entries
            .map(lambda entry: (entry[0][0], (entry[0][1], entry[1])))  # => RDD[tuple[str, tuple[str, int]]]
            # Group by word and put the occurrences in different documents to an Array
            .groupByKey()
            .mapValues(lambda values: list(values))  # => RDD[tuple[str, list[tuple[str, int]]]]
        )

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
    def _create_pairs(entry: NameLinesType) -> list[WordDocumentType]:
        """
        Create (word, document_name) pairs
        :param entry: (document name, lines) tuple
        :return: a list of (word, document_name) pairs
        """
        document = entry[0]
        lines = entry[1]
        pairs = []

        for line in lines:
            for word in line.split(" "):
                pairs.append((word, document))

        return pairs

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

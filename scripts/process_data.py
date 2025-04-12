import re
from pathlib import Path
from typing import TypeAlias

from pyspark import SparkContext, RDD
from stop_words import get_stop_words

NameContentType: TypeAlias = tuple[str, str]
NameLinesType: TypeAlias = tuple[str, list[str]]
WordDocumentType: TypeAlias = tuple[str, str]
WordDocIntType: TypeAlias = tuple[WordDocumentType, int]

spark = SparkContext()
cwd = Path.cwd()
data_path: Path = cwd.parent.joinpath('data')
stopwords_broadcast = spark.broadcast(set(get_stop_words('english')))


def beautify_name(title_page: str) -> str:
    """
    The general pattern of the .txt files is that they start with the name of the play
    This function exploits this pattern with RegEx
    :param title_page: string with the play's beginning
    :return: the matched name
    """
    return re.match(r'^.*?(?=\n)', title_page)[0]


def create_pairs(entry: NameLinesType) -> list[WordDocumentType]:
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


def is_stopword(word: str) -> bool:
    """Check whether the word is a stop-word"""
    stop_words = stopwords_broadcast.value

    return word.lower() in stop_words


def remove_suffix(text: str) -> str:
    """Remove the suffix from a string, naive implementation"""
    return re.sub(r'(ing|ed|ly)$', '', text.strip())


def main() -> None:
    texts: RDD[NameContentType] = spark.wholeTextFiles(str(data_path))

    text: RDD[NameContentType] = texts.map(lambda entry: (beautify_name(entry[1][:50]), entry[1]))

    split_text: RDD[NameLinesType] = text.map(lambda entry: (entry[0], entry[1].splitlines()))

    words_in_docs: RDD[WordDocumentType] = split_text.flatMap(create_pairs)

    filtered_words_in_docs: RDD[WordDocumentType] = (
        words_in_docs
        .filter(lambda entry: not is_stopword(entry[0]))
        .map(lambda entry: (remove_suffix(entry[0]), entry[1]))
    )

    # Add frequency to the entry
    words_in_docs_freq: RDD[WordDocIntType] = filtered_words_in_docs.map(lambda entry: (entry, 1))

    words_in_docs_count: RDD[WordDocIntType] = words_in_docs_freq.reduceByKey(lambda x, y: x + y)

    words_in_docs_count: RDD[tuple[str, tuple[str, int]]] = (  # Restructure the entries
        words_in_docs_count.map(lambda entry: (entry[0][0], (entry[0][1], entry[1])))
    )

    inverted_idx = words_in_docs_count.groupByKey().mapValues(lambda values: list(values))

    # inverted_idx.saveAsTextFile(str(data_path.joinpath('inverted_idx.txt')))

    print(inverted_idx.take(50))


if __name__ == '__main__':
    main()

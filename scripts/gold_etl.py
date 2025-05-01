from pyspark.sql import SparkSession

from utils import (
    get_etl_conn_uri, GoldDataExtractor, GoldDataTransformer, DataLoader, SparkBase
)


def main() -> None:
    conn = get_etl_conn_uri()

    sb = SparkBase(conn=conn, spark_name='gold-etl')

    spark: SparkSession = sb.spark

    # E
    extractor = GoldDataExtractor(spark=spark, collections=['silverWords', 'silverWorksYears'])
    dfs = extractor.extract()
    words, chronology = dfs[0], dfs[1]

    # T
    data = GoldDataTransformer.transform(words=words, chronology=chronology)

    # L
    DataLoader(spark=spark).load(
        data=data
        , database='shakespeare'
        , collection='goldWords'
    )


if __name__ == "__main__":
    main()

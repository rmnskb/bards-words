from pyspark.sql import SparkSession

from utils import (
    get_conn_uri, SilverDataExtractor, SilverDataTransformer, DataLoader, SparkBase
)


def main() -> None:
    conn = get_conn_uri(db='shakespeare', collection='words')

    sb = SparkBase(conn=conn, spark_name='silver-etl')

    spark: SparkSession = sb.spark

    # E
    extractor = SilverDataExtractor(spark=spark, database='shakespeare', collection='indices')
    raw_data = extractor.extract().drop('_id')

    # T
    data = SilverDataTransformer.transform(raw_data)

    # L
    # TODO: implement schema comparison
    DataLoader(spark=spark).load(
        data=data
        , database='shakespeare'
        , collection='words'
        , write_mode='overwrite'
    )


if __name__ == "__main__":
    main()

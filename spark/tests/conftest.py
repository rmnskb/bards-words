import pytest
from pyspark import SparkContext, RDD
from pyspark.sql import SparkSession, DataFrame


@pytest.fixture(scope="session")
def spark_session() -> SparkSession:
    """Create a Spark Session for testing"""
    spark = (
        SparkSession.builder
        .master("local[*]")
        .appName("pytest-spark-local")
        .config("spark.driver.host", "localhost")
        .getOrCreate()
    )

    yield spark


@pytest.fixture(scope="session")
def spark_context(spark_session: SparkSession) -> SparkContext:
    """Create a Spark Context for testing"""
    yield spark_session.sparkContext


@pytest.fixture
def sample_rdd(spark_context: SparkContext) -> RDD:
    """Mock .txt RDDs for testing"""
    return spark_context.wholeTextFiles('./test_data/')

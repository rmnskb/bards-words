from pyspark import SparkContext

# Spark's dependency management guide suggests
# decompressing the local dependency directories into .zip files
# and the submitting them along with the actual job as a dependency
# via spark-submit --py-files <dependency>.zip
from etl.extract import DataExtractor
from etl.transform import DataTransformer


def main():
    spark = SparkContext(appName="shakespeare-etl")

    # E from ETL
    DataExtractor.extract()
    raw_data = spark.wholeTextFiles(str(DataExtractor.data_folder))

    # T from ETL
    transformer = DataTransformer(spark=spark)
    data = transformer.transform(data=raw_data)

    # Side Effects from ETL
    print(data.take(50))


if __name__ == "__main__":
    main()

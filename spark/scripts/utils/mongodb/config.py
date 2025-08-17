import os


def get_etl_conn_uri() -> str:
    user = os.getenv("DB_ETL_USER")
    pwd = os.getenv("DB_ETL_PWD")
    host = os.getenv("HOST")
    port = os.getenv("MONGODB_PORT")

    return f"mongodb://{user}:{pwd}@{host}:{port}/shakespeare?authSource=shakespeare"


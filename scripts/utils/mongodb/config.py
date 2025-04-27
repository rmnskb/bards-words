import os
# from dotenv import load_dotenv

# load_dotenv()


def get_etl_conn_uri() -> str:
    user = os.getenv("DB_ETL_USER")
    pwd = os.getenv("DB_ETL_PWD")
    host = "mongodb"
    port = 27017

    return f"mongodb://{user}:{pwd}@{host}:{port}/shakespeare?authSource=shakespeare"


if __name__ == "__main__":
    print(get_etl_conn_uri())

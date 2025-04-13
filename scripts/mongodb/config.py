import os
from dotenv import load_dotenv

load_dotenv()


def get_conn_uri(db: str, collection: str) -> str:
    user = os.getenv("MONGO_INITDB_ROOT_USERNAME")
    pwd = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
    host = "mongodb"
    port = 27017

    return f"mongodb://{user}:{pwd}@{host}:{port}/{db}:{collection}?authSource=admin"


if __name__ == "__main__":
    print(get_conn_uri(db='shakespeare', collection='words'))

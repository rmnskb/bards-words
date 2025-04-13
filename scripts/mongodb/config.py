def get_conn_uri(db: str, collection: str) -> str:
    host = "mongodb"
    port = 27017

    return f"mongodb://{host}:{port}/{db}:{collection}"
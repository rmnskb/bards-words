# Shakespeare Works

The idea of this app is to create an E2E application that does following things:

- Containerise the whole application, including Spark and Mongo
- An ETL process to download Shakespeare's works and create a collection of the words
  that appeared there;
- Upload the processed collection to MongoDB;

# How do I make use of it

Ensure that you have Docker installed and spun up.  
Then run following command in the main directory:

```bash
docker-compose up -d --build  # Build and run the containers in detached mode

docker exec -it spark-master bash  # Enter the Spark container

docker exec -it mongodb mongosh  # Enter the MongoDB container via Mongosh
```

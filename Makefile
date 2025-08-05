COMPOSE_CMD := docker compose
BASE_FILE := docker-compose.yml
SPARK_FILE := docker-compose.spark.yml
FLAGS := -d --build

WEB_FILES := -f $(BASE_FILE)
SPARK_FILES := -f $(BASE_FILE) -f $(SPARK_FILE)

web-start:
	$(COMPOSE_CMD) $(WEB_FILES) up $(FLAGS)

web-stop:
	$(COMPOSE_CMD) $(WEB_FILES) down

web-restart:
	web-stop web-start

spark-start:
	$(COMPOSE_CMD) $(SPARK_FILES) up $(FLAGS)

spark-stop:
	$(COMPOSE_CMD) $(SPARK_FILES) down

spark-restart:
	spark-stop spark-start

stop:
	$(COMPOSE_CMD) down

clean: stop
	$(COMPOSE_CMD) down -v --remove-orphans

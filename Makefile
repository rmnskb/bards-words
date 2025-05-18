start-web:
	sudo docker compose -f docker-compose.yml up -d --build

stop-web:
	sudo docker compose -f docker-compose.yml down

start-spark:
	sudo docker compose -f docker-compose.yml -f docker-compose.spark.yml up -d --build

stop-spark:
	sudo docker compose -f docker-compose.yml -f docker-compose.spark.yml down

stop:
	sudo docker compose down 


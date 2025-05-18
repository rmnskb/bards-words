web:
	sudo docker compose up -d --build

spark:
	sudo docker compose -f docker-compose.yml -f docker-compose.spark.yml up -d --build

down:
	sudo docker compose down 


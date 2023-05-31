all: up

up:
	sudo mkdir -p ./srcs/data/db
	docker compose -f ./srcs/docker-compose.yml up --build

down:
	docker compose -f ./srcs/docker-compose.yml down

clean: down
	docker image prune -f
	docker container prune -f
	docker volume prune -f
	docker network prune -f
	docker volume rm -f `docker volume ls -q`
	docker rmi `docker images -q`

fclean: clean

rmdatabase:
	sudo rm -rf ./srcs/data/db
	sudo mkdir  ./srcs/data/db

re: fclean all

.PHONY: all up down clean fclean re rmdatabase

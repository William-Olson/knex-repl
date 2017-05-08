all:
	@make kill
	@make -s build
	@make -s run

build:
	node ./stampBuild.js
	docker build -t willko/knex-repl:latest .

run:
	docker run -d -it -p 9933:9933 willko/knex-repl

kill:
	docker stop `docker ps -a -q --filter ancestor=willko/knex-repl --format="{{.ID}}"` || true



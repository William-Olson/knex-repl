all:
	@make -s build
	@make -s run

build:
	docker build -t willko/knex-repl:latest .

run:
	docker run -it -p 9933:9933 willko/knex-repl
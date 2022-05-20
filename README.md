## knex-repl

[![CircleCI](https://circleci.com/gh/William-Olson/knex-repl/tree/master.svg?style=svg)](https://circleci.com/gh/William-Olson/knex-repl/tree/master)

Extremely simple `knex query` to `sql` converter.


#### How to Run

##### Docker

Available as a docker image. Run the following 2 commands in your terminal...

```
docker pull willko/knex-repl
docker run -it -p 9933:9933 willko/knex-repl
```

After running the above docker commands, the repl should be
accessible at `http://localhost:9933` (use `-p <port>:9933` for desired port).

You can also specify a different port if 9933 is already being used.

##### Build Locally

Simply clone the repo and run `make`.

#### Screenshots

Super minimal UI.

![alt-text][ex-img]


[ex-img]: ./screenshots/ex-img.png

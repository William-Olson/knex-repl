## knex-repl

[![CircleCI](https://circleci.com/gh/William-Olson/knex-repl/tree/master.svg?style=svg)](https://circleci.com/gh/William-Olson/knex-repl/tree/master)
[![GitHub package.json version](https://img.shields.io/github/package-json/v/William-Olson/knex-repl?label=LATEST&logo=docker&style=flat)](https://hub.docker.com/r/willko/knex-repl)

Extremely simple `knex query` to `sql` converter.


#### How to Run

### Docker

Available as a docker image. Run the following 2 commands in your terminal...

```
docker pull willko/knex-repl
docker run -it -p 9933:9933 willko/knex-repl
```

After running the above docker commands, the repl should be
accessible at `http://localhost:9933` (use `-p <port>:9933` for desired port).


### Build Locally

Simply clone the repo and run `npm install` then `make`.

#### Screenshots

Super minimal UI.

![alt-text][ex-img]


[ex-img]: ./screenshots/ex-img.png

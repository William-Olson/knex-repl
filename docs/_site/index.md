## knex-repl

Extremely simple `knex query` to `sql` converter.


## Features

  - Autoconverts you knex code on changes
  - Selectable colorschemes for syntax highlighting
  - Insert iife button to allow variable declarations
  - Copy buttons to quickly copy knex or sql code

## Docker

### Install

```
docker pull willko/knex-repl:latest
```

### Run

```
docker run -it -p 9933:9933 willko/knex-repl:latest
```

## About

Built for streamlining implementation of knex queries to assure exactly what
the sql output will be. Knex-Repl is a handy tool for any developer using knex.

### Info and Links

  - [source code][gh-link]
  - [live demo][demo]
  - [docker image][docker-link]


[demo]: https://knex.wko.io
[gh-link]: https://github.com/william-olson/knex-repl
[docker-link]: https://hub.docker.com/r/willko/knex-repl/

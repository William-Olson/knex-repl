## knex-repl

Extremely simple `knex query` to `sql` converter.


#### How to Run

##### Docker

Available as a docker image...

```
docker pull willko/knex-repl
docker run -it -p 9933:9933 willko/knex-repl
```

After running the above docker commands, the repl should be
accessible at `http://localhost:9933`

##### Build Locally

Simply clone the repo and run `make`.

#### Screenshots

Super minimal UI.

![alt-text][ex-img]


[ex-img]: ./screenshots/ex-img.png
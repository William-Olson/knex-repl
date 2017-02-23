FROM node:7

WORKDIR /opt/knex-repl

EXPOSE 9933

RUN mkdir -p /opt/knex-repl/app

COPY ./package.json /opt/knex-repl/package.json

RUN npm install

COPY . /opt/knex-repl/app

ENTRYPOINT /opt/knex-repl/app

CMD ["npm", "start"]

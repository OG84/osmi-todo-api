FROM node as build-env
LABEL author Christian Götze
COPY . /usr/app
WORKDIR /usr/app

RUN yarn
RUN yarn webpack-prod

FROM node as runtime-env
WORKDIR /usr/app
COPY --from=build-env /usr/app/dist .
COPY --from=build-env /usr/app/config ./config

EXPOSE 3000 7474 7473 7687
ENTRYPOINT [ "node", "server.js" ]
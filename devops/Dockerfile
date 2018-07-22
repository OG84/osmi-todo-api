FROM node as build-env
LABEL author Christian Götze
COPY . /usr/app
WORKDIR /usr/app

RUN yarn
RUN yarn webpack-prod

FROM neo4j as runtime-env
RUN apk add --update nodejs
COPY --from=build-env /usr/app/dist /usr/app/
COPY --from=build-env /usr/app/devops/multi-service.sh /usr/app/multi-service.sh
EXPOSE 3000
ENV environment=prod

CMD /usr/app/multi-service.sh
FROM node:16-alpine3.15

RUN mkdir /app
WORKDIR /app

COPY . .

CMD [ "node", "." ]

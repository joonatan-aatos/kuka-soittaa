FROM node:16

WORKDIR /usr/src/app

COPY build ./build

RUN yarn global add serve

EXPOSE 8080

CMD ["serve", "-s", "build", "-l", "8080"]

FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY build ./build
COPY prisma ./prisma
COPY defaults ./defaults

COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT [ "./docker-entrypoint.sh" ]

EXPOSE 3000
CMD [ "node", "build/index.js" ]

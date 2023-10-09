FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 4500

CMD yarn migration:run && yarn test && yarn start
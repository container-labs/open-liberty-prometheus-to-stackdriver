FROM node:alpine

COPY package.json .
RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "start"]

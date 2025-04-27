FROM node:lts-alpine AS node

## Install curl for healthcheck
RUN apk add --no-cache curl

WORKDIR app/

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000" ]

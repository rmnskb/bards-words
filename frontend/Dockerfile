FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM alpine:3.14 AS prod

WORKDIR /app

COPY --from=build /app/dist /app/dist

CMD ["tail", "-f", "/dev/null"]

LABEL org.opencontainers.image.source=https://github.com/rmnskb/bards-words

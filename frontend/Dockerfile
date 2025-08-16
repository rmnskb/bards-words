FROM node:lts-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

FROM nginx:alpine AS prod

COPY --from=build /app/dist /usr/share/nginx/html

# Install curl for healthcheck
RUN apk add --no-cache curl

EXPOSE 3000

CMD [ "nginx", "-g", "daemon off;" ]

LABEL org.opencontainers.image.source=https://github.com/rmnskb/bards-words

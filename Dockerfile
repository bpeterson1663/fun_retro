FROM nginx:1.17.3-alpine

RUN apk add git
RUN apk add --update npm

COPY / /
RUN cat .env.local
RUN npm ci --only=prod
RUN npm run build
WORKDIR /usr/share/nginx/html

COPY build/ ./
COPY nginx.conf /etc/nginx/nginx.conf
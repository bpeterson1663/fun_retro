FROM node:10.16.0 as react-build

WORKDIR /app

COPY . ./

RUN npm

RUN npm build
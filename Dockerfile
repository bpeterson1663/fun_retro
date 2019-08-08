FROM node

COPY . /

RUN npm install

EXPOSE 8080

ENTRYPOINT ["node", "./src/index.js"]
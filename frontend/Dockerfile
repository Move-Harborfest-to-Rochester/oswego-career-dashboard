FROM node:alpine

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install -g @angular/cli

RUN npm install

EXPOSE 4200/tcp

CMD ["ng", "serve", "--host", "0.0.0.0", "--configuration", "oswego-docker"]
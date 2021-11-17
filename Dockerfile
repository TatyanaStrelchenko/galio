FROM node:12.13.0 AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . /usr/src/app
RUN npm run build

FROM nginx:1.17.0-alpine
COPY ./nginx.config /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
COPY --from=builder /usr/src/app/build /usr/share/nginx/html

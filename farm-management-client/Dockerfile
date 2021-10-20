# build stage
FROM  node:alpine3.13 As builder

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build --prod

# Production stage
FROM nginx:stable-alpine

COPY --from=builder /usr/src/app/dist/farm-management-client /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 4150

CMD ["nginx", "-g", "daemon off;"]
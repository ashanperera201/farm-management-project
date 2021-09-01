FROM node:stretch-slim

#Create app directory
WORKDIR /user/src/app

# Remove package-lock file.
RUN rm -rf package-lock.json

# Install app dependencies

COPY package.json ./

RUN npm install

COPY . .

# Bind to all network interfaces so that it can be mapped to the host OS


ARG DOCKER_ENV
ENV NODE_ENV=${DOCKER_ENV}
RUN if [ "$DOCKER_ENV" = "stag" ] ; then  echo   your NODE_ENV for stage is $NODE_ENV;  \
    else  echo your NODE_ENV for dev is $NODE_ENV; \
    fi 

ENV NODE_ENV=dev HOST=0.0.0.0 PORT=3001

EXPOSE ${PORT}

# CMD ["cross-env", "NODE_ENV=${NODE_ENV}", "node", "startup.js" ]
# CMD [ "npm" ,"npm run development-start", "start" ]
CMD npm run development-start
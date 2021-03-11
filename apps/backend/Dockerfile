FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile --production=true

# Bundle app source
COPY . .

EXPOSE 3200
CMD [ "node", "index.js" ]
# use latest node image
FROM node:latest

# set working directory
WORKDIR /be

# install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install --silent

# add app
COPY . ./

EXPOSE 5000

# start app
CMD ["npm", "start"]

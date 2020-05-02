# use latest node image
FROM node:latest

# set working directory
WORKDIR /fe

# install app dependencies
COPY package.json .
COPY package-lock.json .

RUN npm install --silent

# add app
COPY . ./

RUN npm run build
RUN npm install -g serve
EXPOSE 5000

# start app
CMD ["serve", "-s", "build"]

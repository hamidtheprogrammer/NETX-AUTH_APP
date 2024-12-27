# use an official node runtime
FROM node:22-alpine

# set the working directory
WORKDIR /app

#copy meta
COPY package*.json .

# install dependencies
RUN npm install

#copy rest files
COPY . .

#expose a port
EXPOSE 8000

#run application
CMD [ "npm", "run", "dev" ]
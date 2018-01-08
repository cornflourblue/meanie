# specify the node base image with your desired version node:<version>
FROM node:8

# copy app code to directory in container
ADD . /app

# change directory so that our commands run inside this new directory
WORKDIR /app/server

# install dependecies
RUN npm install

# port to listen on
EXPOSE 3000

# serve the app
CMD ["npm", "start"]
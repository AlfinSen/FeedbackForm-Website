FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port 3000 to the network
EXPOSE 3000

# Start the application
CMD [ "npm", "start" ]

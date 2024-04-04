# Use node:lts-alpine3.19 as the base image for a smaller footprint
FROM node:lts-alpine3.19

# Create a directory named 'app' inside the container's filesystem and set it as the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code from the host machine to the 'app' directory in the Docker container
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app using node
CMD ["node", "index.js"]

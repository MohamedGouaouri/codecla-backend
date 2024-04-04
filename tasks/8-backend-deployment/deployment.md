## Deployment
In ths assignment, you're going to deploy your backend services (express and nestjs) using Docker.

### 1. Initial setup
To complete this assignment, you need to have docker engine installed on your system. For more details about how to install it please checkout this [link](https://docs.docker.com/engine/install/).

### 2. Deploy expressjs application

- Create a `Dockerfile` for the application.
    - As a base image, use `node:lts-alpine3.19`, it has a small size compared to other images.
    - Create a directory named `app` inside the container's filesystem and sets it as the working directory for subsequent commands. This is where your application code will be copied.
    - Copy the `package.json` file.
    - Run the command that installs the packages.
    - Copy the code files host machine to the `app` directory in the Docker container.
    - Expose the application port.
    - Run the command that starts the server
- Build the docker image and give a tag of `codecla-express:v1` for example.
- Run the container
  - Before running the container, start a MongoDB server using the official MongoDB Docker image.
  - Ensure that you publish the necessary ports and pass the required environment variables like the database URL, secret keys, etc.
- Make sure that all endpoints of your Express.js application work as expected.

### 3. Deploy nestjs application
To deploy your nestjs application, we are going to use **two-stages build** as it optimized nest js builds to end up with a small image size.

First, you need to create a `Dockerfile`, then follow these steps

#### Development stage

For the development stage:
- Use the same nodejs base image,  `node:lts-alpine3.19`.
- Create a directory named `app` inside the container's filesystem and sets it as the working directory
- Copy the `package.json` file.
- Run the command that installs the packages.
- Copy the code files host machine to the `app` directory in the Docker container.
- Run the build command.

#### Production stage
For the production stage:
- Use the same nodejs base image,  `node:lts-alpine3.19`.
- Set the working dir to `app`.
- Copy the `package.json` file.
- Install **production-only** packages, using `npm install --only=production`.
- Copy the code files host machine to the `app` directory in the Docker container.
- Copy the generated `dist` directory from the `development stage` to this container.
- Execute the main script using `node`.
- Build the docker image and give a tag of `codecla-nestjs:v1` for example.
- Run the container
    - Before running the container, start a MongoDB server using the official MongoDB Docker image.
    - Ensure that you publish the necessary ports and pass the required environment variables like the database URL.
- Make sure that all endpoints of your Nest.js application work as expected.


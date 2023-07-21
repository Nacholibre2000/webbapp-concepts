FROM python:3.11.4-bullseye

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

WORKDIR /app
COPY . /app

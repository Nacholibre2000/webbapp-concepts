FROM python:3.11.4-bullseye

# Install Node.js and npm
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Install poetry
RUN pip install poetry

WORKDIR /app

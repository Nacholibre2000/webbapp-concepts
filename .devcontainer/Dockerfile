FROM python:3.11.4-bullseye

# Install Node.js and npm
RUN curl -fsSL https://deb.nodesource.com/setup_current.x | bash - &&\
apt-get install -y nodejs

# Install poetry
RUN pip install poetry

WORKDIR /app

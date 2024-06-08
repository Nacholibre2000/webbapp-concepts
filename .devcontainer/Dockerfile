FROM python:3.11.4-bullseye

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y curl && \
    curl -sL https://deb.nodesource.com/setup_14.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Add Poetry to PATH
ENV PATH="/root/.local/bin:$PATH"

# Set the working directory
WORKDIR /app

# Copy the entire project directory contents into the container at /app
COPY . /app

# Copy package.json specifically from the client directory
COPY client/package.json /app/client/package.json

# Install Node.js dependencies from the client directory
RUN cd /app/client && npm install

# Set working directory to the server directory
WORKDIR /app/server

# Install Python dependencies
RUN poetry install

# Expose a port if your application runs on a specific port (e.g., 8080)
# EXPOSE 8080

# Command to run the application
# CMD ["python", "app.py"] or other command to start your application

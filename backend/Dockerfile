# Use official Node 22 image
FROM node:22-bullseye

# Install system dependencies needed for node-canvas
RUN apt-get update && apt-get install -y \
    build-essential \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install npm dependencies (canvas will build correctly)
RUN npm install

# Copy rest of the app and start
COPY . .
EXPOSE 8080
CMD ["npm", "start"]

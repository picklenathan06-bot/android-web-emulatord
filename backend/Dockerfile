# Use latest LTS Node
FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
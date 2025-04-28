# Use Node.js official image
FROM node:20

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to install dependencies separately)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY . /app

# Expose the port (same as in app.js)
EXPOSE 3000

# Command to run the server
CMD ["npm", "run", "dev"]

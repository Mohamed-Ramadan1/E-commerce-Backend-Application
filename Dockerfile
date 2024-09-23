# Use an official Node.js runtime as the base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies
RUN npm install 

# Copy the rest of the application code to the working directory
COPY . .

# If you're using TypeScript, compile it
RUN npm run build

# Expose the port that your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["node", "dist/bundle.js"]
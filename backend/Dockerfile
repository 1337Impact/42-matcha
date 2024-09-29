# Dockerfile for the backend

FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# get the database url from the environment
ARG DATABASE_URL
# set the database url in the environment variables of the backend app .env file
# RUN echo "DATABASE_URL=$DATABASE_URL" >> .env

# Install ts-node globally
RUN npm install -g ts-node

# Build the TypeScript code (if applicable)
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Initialize the database and start the backend server
CMD ["npx", "ts-node", "src/utils/db/init_db.ts", "&&", "npm", "run", "start"]
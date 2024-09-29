FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Get the database URL from the environment
ARG DATABASE_URL
# Set the database URL in the environment variables of the backend app .env file
# RUN echo "DATABASE_URL=$DATABASE_URL" >> .env

# Install ts-node globally
RUN npm install -g ts-node

# Build the TypeScript code (if applicable)
RUN npm run build

# Expose the backend port
EXPOSE 5000

# Copy the shell script into the container
COPY start.sh .

# Give execution permission to the shell script
RUN chmod +x start.sh

# Run the shell script
CMD ["./start.sh"]

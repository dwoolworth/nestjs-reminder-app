# Stage 1: Build the application
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code and build the project
COPY . .
RUN npm run build

# Stage 2: Create the production image
FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files and installed modules from the builder stage
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy the built application from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose the port that your NestJS app listens on (default is 3000)
EXPOSE 3000

# Command to run your NestJS app
CMD ["node", "dist/main.js"]

# Use the official Node.js 22 Alpine image to match your local runtime environment
FROM node:22-alpine

# Create and set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker build cache for node_modules
COPY package.json package-lock.json ./

# Install production dependencies only (skip dev dependencies)
RUN npm ci --only=production

# Copy all backend source code (filtered by .dockerignore)
COPY . .

# Set Node environment to production
ENV NODE_ENV=production

# Run the backend server
CMD ["node", "app.js"]

# Multi-stage build for development and production
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev dependencies)
RUN npm ci

# Copy source code
COPY . .

# Development stage
FROM base AS development-stage

# Set environment to development
ENV NODE_ENV=development

# Expose development port (Vite default)
EXPOSE 5173

# Start development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Build stage for production
FROM base AS build-stage

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine AS production-stage

# Copy built assets from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config (optional)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
# Dockerfile for Next.js Application

# Stage 1: Builder
# This stage installs dependencies, builds the application, and prepares the production artifacts.
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# We use pnpm, so we need to install it first
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml to leverage Docker cache
COPY package.json pnpm-lock.yaml ./

# Install dependencies using pnpm
RUN pnpm install

# Copy the rest of the application source code
COPY . .

# Build the Next.js application for production
RUN pnpm run build

# Stage 2: Runner
# This stage creates the final, lightweight image with only the necessary production files.
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment to production
ENV NODE_ENV=production

# We use pnpm, so we need to install it first
RUN npm install -g pnpm

# Copy production dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy built application from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Expose the port the app runs on
EXPOSE 3000

# The command to start the application
# Use "pnpm start" which typically runs "next start"
CMD ["pnpm", "start"]

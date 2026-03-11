# ----------------------
# Builder Stage
# ----------------------
FROM node:20-bullseye-slim AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app
COPY . .

# Build Next.js for production
RUN npm run build

# ----------------------
# Production Stage
# ----------------------
FROM node:20-bullseye-slim

# Set working directory
WORKDIR /app

# Copy built app and dependencies from builder
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

# Expose the port your app will run on
ENV PORT=8085
EXPOSE 8085

# Start the app
CMD ["npm", "start", "--", "-p", "8085", "-H", "0.0.0.0"]
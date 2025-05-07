# Stage 1: Build the app
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack and prepare pnpm
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate && pnpm install --frozen-lockfile

# Copy source code and build
COPY . .
RUN pnpm build

# Stage 2: Run the app in a minimal environment
FROM node:22-alpine

WORKDIR /app

# Enable corepack and prepare pnpm (optional if you use only built output)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only necessary files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/dist ./dist

# Install only production dependencies
RUN pnpm install --frozen-lockfile

# Expose app port
EXPOSE ${PORT:-3000}

# Healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT:-3000}/health || exit 1

# Start the app
CMD ["pnpm", "start"]
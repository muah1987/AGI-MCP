# AGI-MCP Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --ignore-scripts

# Copy source code
COPY src ./src

# Build TypeScript to JavaScript
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Copy necessary runtime files
COPY memory ./memory
COPY .agi-mcp ./.agi-mcp

# Create data directory for SQLite database
RUN mkdir -p data && \
    mkdir -p memory/logs && \
    chown -R node:node /app

# Switch to non-root user for security
USER node

# Set environment variables
ENV NODE_ENV=production
ENV AGI_MCP_DATA_DIR=/app/data
ENV AGI_MCP_MEMORY_DIR=/app/memory

# Expose port if needed (for future HTTP/WebSocket support)
# EXPOSE 3000

# Health check (checks if the server can start)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('./dist/index.js')" || exit 1

# Default command - runs the MCP server via stdio
CMD ["node", "dist/index.js"]

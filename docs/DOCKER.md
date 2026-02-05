# AGI-MCP Docker Guide

Complete guide for building, testing, and deploying AGI-MCP with Docker.

## Table of Contents

- [Quick Start](#quick-start)
- [Using Pre-built Images](#using-pre-built-images)
- [Building Locally](#building-locally)
- [Testing](#testing)
- [Publishing to Docker Hub](#publishing-to-docker-hub)
- [Environment Configuration](#environment-configuration)
- [MCP Client Setup](#mcp-client-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Pull and Run

```bash
# Pull from Docker Hub
docker pull muah1987/agi-mcp:latest

# Run the server
docker run -i --rm muah1987/agi-mcp:latest
```

### With Persistent Storage

```bash
docker run -i --rm \
  -v agi-mcp-data:/app/data \
  -v agi-mcp-logs:/app/memory/logs \
  muah1987/agi-mcp:latest
```

## Using Pre-built Images

AGI-MCP is available on Docker Hub at `muah1987/agi-mcp`.

### Available Tags

- `latest` - Latest stable release
- `1.0.0` - Specific version tags
- `dev` - Development builds (if available)

### Pull Specific Version

```bash
# Latest
docker pull muah1987/agi-mcp:latest

# Specific version
docker pull muah1987/agi-mcp:1.0.0
```

### Run with MCP Client

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "muah1987/agi-mcp:latest"]
    }
  }
}
```

## Building Locally

### Prerequisites

- Docker 20.10 or higher
- 2GB free disk space
- Internet connection for downloading dependencies

### Build Command

```bash
# Clone repository
git clone https://github.com/muah1987/AGI-MCP.git
cd AGI-MCP

# Build image
docker build -t agi-mcp:latest .
```

### Build with Custom Tag

```bash
docker build -t agi-mcp:dev .
docker build -t my-registry/agi-mcp:latest .
```

### Multi-platform Build

```bash
# For multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 -t agi-mcp:latest .
```

## Testing

### Run Test Script

The included test script validates the Docker build:

```bash
# Make executable
chmod +x test-docker.sh

# Run tests
./test-docker.sh
```

### Test Checklist

The script validates:
- ✓ Image builds successfully
- ✓ Container starts without errors
- ✓ Health checks pass
- ✓ Memory infrastructure exists
- ✓ Data directories are created
- ✓ Build artifacts are present
- ✓ No critical errors in logs

### Manual Testing

```bash
# Start container
docker run -d --name agi-mcp-test agi-mcp:latest

# Check logs
docker logs agi-mcp-test

# Execute commands inside container
docker exec agi-mcp-test ls -la /app/dist

# Check health
docker inspect --format='{{.State.Health.Status}}' agi-mcp-test

# Cleanup
docker stop agi-mcp-test
docker rm agi-mcp-test
```

## Publishing to Docker Hub

### Prerequisites

1. Docker Hub account (create at https://hub.docker.com)
2. Access token (generate at https://hub.docker.com/settings/security)

### Setup Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required variables in `.env`:
```bash
DOCKER_USERNAME=your-dockerhub-username
DOCKER_TOKEN=your-access-token
DOCKER_IMAGE_NAME=agi-mcp
DOCKER_IMAGE_TAG=latest
```

### Push to Docker Hub

```bash
# Run the push script
./push-docker.sh
```

The script automatically:
1. Loads environment variables from `.env`
2. Builds the Docker image
3. Tags with `latest` and version from `package.json`
4. Logs in to Docker Hub
5. Pushes both tags
6. Logs out automatically

### Manual Push

```bash
# Build image
docker build -t your-username/agi-mcp:latest .

# Login
docker login -u your-username

# Push
docker push your-username/agi-mcp:latest

# Logout
docker logout
```

## Environment Configuration

### .env File

The `.env` file configures Docker Hub credentials and server settings.

**Example `.env`:**
```bash
# Docker Hub
DOCKER_USERNAME=muah1987
DOCKER_TOKEN=dckr_pat_xxxxxxxxxxxxx
DOCKER_IMAGE_NAME=agi-mcp
DOCKER_IMAGE_TAG=latest

# Server Config
NODE_ENV=production
AGI_MCP_DEBUG=false
ENABLE_HOOKS=true
ENABLE_SUBAGENTS=true
```

### Environment Variables

Available runtime environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `AGI_MCP_DATA_DIR` | `/app/data` | Database directory |
| `AGI_MCP_MEMORY_DIR` | `/app/memory` | Memory/logs directory |
| `AGI_MCP_DEBUG` | `false` | Enable debug logging |
| `ENABLE_HOOKS` | `true` | Enable hook system |
| `ENABLE_SUBAGENTS` | `true` | Enable subagents |
| `DB_WAL_MODE` | `true` | SQLite WAL mode |
| `LOG_RETENTION_DAYS` | `30` | Log retention period |

### Pass Environment Variables

```bash
docker run -i --rm \
  -e NODE_ENV=development \
  -e AGI_MCP_DEBUG=true \
  muah1987/agi-mcp:latest
```

## MCP Client Setup

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "muah1987/agi-mcp:latest"]
    }
  }
}
```

### Cline (VSCode)

Edit Cline MCP settings:

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "muah1987/agi-mcp:latest"]
    }
  }
}
```

### With Persistent Storage

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm",
        "-v", "agi-mcp-data:/app/data",
        "-v", "agi-mcp-logs:/app/memory/logs",
        "muah1987/agi-mcp:latest"
      ]
    }
  }
}
```

## Production Deployment

### Using Docker Compose

The included `docker-compose.yml` provides production-ready configuration:

```bash
# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Features

- **Persistent Volumes** - Data and logs persist across restarts
- **Resource Limits** - CPU and memory constraints
- **Health Checks** - Automatic container health monitoring
- **Auto-restart** - Restarts on failure
- **Logging** - Structured JSON logs with rotation

### Kubernetes Deployment

Example Kubernetes deployment:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agi-mcp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: agi-mcp
  template:
    metadata:
      labels:
        app: agi-mcp
    spec:
      containers:
      - name: agi-mcp
        image: muah1987/agi-mcp:latest
        resources:
          limits:
            memory: "2Gi"
            cpu: "2000m"
          requests:
            memory: "512Mi"
            cpu: "500m"
        volumeMounts:
        - name: data
          mountPath: /app/data
        - name: logs
          mountPath: /app/memory/logs
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: agi-mcp-data
      - name: logs
        persistentVolumeClaim:
          claimName: agi-mcp-logs
```

### Monitoring

Health check endpoint:

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' agi-mcp

# View health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' agi-mcp
```

## Troubleshooting

### Image Won't Build

```bash
# Clear Docker cache
docker builder prune -a

# Build without cache
docker build --no-cache -t agi-mcp:latest .
```

### Container Won't Start

```bash
# Check logs
docker logs agi-mcp-test

# Run interactively
docker run -it --entrypoint /bin/sh agi-mcp:latest

# Check filesystem
docker run --rm agi-mcp:latest ls -la /app
```

### Permission Issues

```bash
# Container runs as non-root user (node)
# Check ownership
docker run --rm agi-mcp:latest ls -la /app/data
```

### Database Issues

```bash
# Check if database exists
docker exec agi-mcp ls -la /app/data/agi-mcp.db

# View database permissions
docker exec agi-mcp stat /app/data/agi-mcp.db
```

### MCP Client Connection Issues

1. **Check container is running:**
```bash
docker ps | grep agi-mcp
```

2. **Test container manually:**
```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | docker run -i --rm agi-mcp:latest
```

3. **Check MCP client logs** for connection errors

### Memory Issues

```bash
# Check container memory usage
docker stats agi-mcp

# Increase memory limit in docker-compose.yml
# Or run with higher limit
docker run -i --rm -m 4g muah1987/agi-mcp:latest
```

### Common Error Messages

| Error | Solution |
|-------|----------|
| `ENOENT: no such file or directory` | Volume mount issue, check paths |
| `Permission denied` | Run as correct user or adjust permissions |
| `Cannot find module` | Rebuild image, dependencies missing |
| `Database is locked` | Enable WAL mode or check concurrent access |

## Best Practices

1. **Use specific version tags** in production (not `latest`)
2. **Enable persistent volumes** for data and logs
3. **Set resource limits** to prevent resource exhaustion
4. **Monitor health checks** and logs regularly
5. **Backup volumes** before updates
6. **Use `.dockerignore`** to optimize build
7. **Run as non-root** user (already configured)
8. **Enable WAL mode** for SQLite (default)

## Security

- Container runs as non-root user (`node`)
- Multi-stage build reduces attack surface
- No unnecessary packages in final image
- Health checks for monitoring
- Environment variables for secrets (not hardcoded)

---

For more information, see the [main documentation](../README.md) or [deployment guide](DEPLOYMENT.md).

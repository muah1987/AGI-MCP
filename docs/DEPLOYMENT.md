# AGI-MCP Deployment Guide

## Overview

This guide covers deploying AGI-MCP in production environments, including MCP client configuration, environment setup, monitoring, and troubleshooting.

## Table of Contents

- [Deployment Modes](#deployment-modes)
- [MCP Client Setup](#mcp-client-setup)
- [Production Deployment](#production-deployment)
- [Environment Configuration](#environment-configuration)
- [Security Considerations](#security-considerations)
- [Monitoring and Logging](#monitoring-and-logging)
- [Backup and Recovery](#backup-and-recovery)
- [Performance Tuning](#performance-tuning)
- [Troubleshooting](#troubleshooting)

## Deployment Modes

### Local Development

For local development and testing:

```bash
# Development mode
npm start

# With auto-reload (development)
npm install -g nodemon
nodemon dist/index.js
```

### Production Server

For production deployments:

```bash
# Build production artifacts
npm run build

# Run in production mode
NODE_ENV=production node dist/index.js

# Or use process manager (recommended)
pm2 start dist/index.js --name agi-mcp
```

### Docker Deployment

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application
COPY dist/ ./dist/

# Create data and memory directories
RUN mkdir -p data memory/logs

# Set environment
ENV NODE_ENV=production

# Expose port (if needed for monitoring)
EXPOSE 3000

# Run server
CMD ["node", "dist/index.js"]
```

Build and run:

```bash
# Build image
docker build -t agi-mcp:latest .

# Run container
docker run -d \
  --name agi-mcp \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/memory:/app/memory \
  -v $(pwd)/.agi-mcp:/app/.agi-mcp \
  agi-mcp:latest
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agi-mcp
  labels:
    app: agi-mcp
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
        image: agi-mcp:latest
        env:
        - name: NODE_ENV
          value: "production"
        volumeMounts:
        - name: data
          mountPath: /app/data
        - name: memory
          mountPath: /app/memory
        - name: config
          mountPath: /app/.agi-mcp
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: agi-mcp-data
      - name: memory
        persistentVolumeClaim:
          claimName: agi-mcp-memory
      - name: config
        configMap:
          name: agi-mcp-config
```

## MCP Client Setup

### Claude Desktop

#### macOS

1. **Configuration Location**:
```bash
~/Library/Application Support/Claude/claude_desktop_config.json
```

2. **Production Configuration**:
```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "node",
      "args": [
        "/opt/agi-mcp/dist/index.js"
      ],
      "env": {
        "NODE_ENV": "production",
        "AGI_MCP_DB_PATH": "/var/lib/agi-mcp/agi-mcp.db",
        "AGI_MCP_LOG_LEVEL": "info"
      },
      "description": "AGI-MCP Production Server"
    }
  }
}
```

#### Linux

1. **Configuration Location**:
```bash
~/.config/Claude/claude_desktop_config.json
```

2. **Systemd Service** (recommended for auto-start):

```ini
# /etc/systemd/system/agi-mcp.service
[Unit]
Description=AGI-MCP Server
After=network.target

[Service]
Type=simple
User=agi-mcp
WorkingDirectory=/opt/agi-mcp
ExecStart=/usr/bin/node /opt/agi-mcp/dist/index.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=AGI_MCP_DB_PATH=/var/lib/agi-mcp/agi-mcp.db

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl enable agi-mcp
sudo systemctl start agi-mcp
sudo systemctl status agi-mcp
```

#### Windows

1. **Configuration Location**:
```
%APPDATA%\Claude\claude_desktop_config.json
```

2. **Windows Service** (using NSSM):

```powershell
# Install NSSM
choco install nssm

# Create service
nssm install AGI-MCP "C:\Program Files\nodejs\node.exe" "C:\agi-mcp\dist\index.js"
nssm set AGI-MCP AppDirectory "C:\agi-mcp"
nssm set AGI-MCP AppEnvironmentExtra "NODE_ENV=production"
nssm start AGI-MCP
```

### Cline (VS Code)

#### Global Configuration

```json
{
  "cline.mcpServers": {
    "agi-mcp": {
      "command": "node",
      "args": ["/opt/agi-mcp/dist/index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

#### Workspace Configuration

`.vscode/settings.json`:
```json
{
  "cline.mcpServers": {
    "agi-mcp": {
      "command": "node",
      "args": ["${workspaceFolder}/dist/index.js"],
      "env": {
        "NODE_ENV": "production",
        "AGI_MCP_DB_PATH": "${workspaceFolder}/data/agi-mcp.db"
      }
    }
  }
}
```

### Other MCP Clients

Generic configuration pattern:

```json
{
  "command": "node",
  "args": ["/path/to/agi-mcp/dist/index.js"],
  "env": {
    "NODE_ENV": "production",
    "AGI_MCP_DB_PATH": "/var/lib/agi-mcp/agi-mcp.db",
    "AGI_MCP_LOG_DIR": "/var/log/agi-mcp",
    "AGI_MCP_LOG_LEVEL": "info"
  }
}
```

## Production Deployment

### Installation

```bash
# 1. Create application user
sudo useradd -r -s /bin/false agi-mcp

# 2. Create directories
sudo mkdir -p /opt/agi-mcp
sudo mkdir -p /var/lib/agi-mcp
sudo mkdir -p /var/log/agi-mcp

# 3. Clone and build
cd /tmp
git clone https://github.com/muah1987/AGI-MCP.git
cd AGI-MCP
npm ci --only=production
npm run build

# 4. Install application
sudo cp -r dist package*.json /opt/agi-mcp/
sudo cp -r node_modules /opt/agi-mcp/

# 5. Set permissions
sudo chown -R agi-mcp:agi-mcp /opt/agi-mcp
sudo chown -R agi-mcp:agi-mcp /var/lib/agi-mcp
sudo chown -R agi-mcp:agi-mcp /var/log/agi-mcp

# 6. Set restricted permissions
sudo chmod 750 /opt/agi-mcp
sudo chmod 750 /var/lib/agi-mcp
sudo chmod 750 /var/log/agi-mcp
```

### Directory Structure (Production)

```
/opt/agi-mcp/           # Application
├── dist/               # Compiled code
├── node_modules/       # Dependencies
└── package.json

/var/lib/agi-mcp/       # Data
├── agi-mcp.db          # Database
└── backups/            # Database backups

/var/log/agi-mcp/       # Logs
└── session-*.log       # Session logs

/etc/agi-mcp/           # Configuration
├── hooks/              # Custom hooks
├── subagents/          # Custom subagents
└── hooks-config.json   # Hook configuration
```

### Process Management

#### Using PM2

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start /opt/agi-mcp/dist/index.js \
  --name agi-mcp \
  --cwd /opt/agi-mcp \
  --env production

# Save PM2 configuration
pm2 save

# Generate startup script
pm2 startup

# Monitor
pm2 monit

# View logs
pm2 logs agi-mcp

# Restart
pm2 restart agi-mcp

# Stop
pm2 stop agi-mcp
```

#### PM2 Ecosystem File

`ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'agi-mcp',
    script: '/opt/agi-mcp/dist/index.js',
    cwd: '/opt/agi-mcp',
    env: {
      NODE_ENV: 'production',
      AGI_MCP_DB_PATH: '/var/lib/agi-mcp/agi-mcp.db',
      AGI_MCP_LOG_DIR: '/var/log/agi-mcp',
      AGI_MCP_LOG_LEVEL: 'info'
    },
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    error_file: '/var/log/agi-mcp/error.log',
    out_file: '/var/log/agi-mcp/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

Start with ecosystem:
```bash
pm2 start ecosystem.config.js
```

## Environment Configuration

### Environment Variables

```bash
# Node environment
NODE_ENV=production

# Database configuration
AGI_MCP_DB_PATH=/var/lib/agi-mcp/agi-mcp.db

# Logging
AGI_MCP_LOG_DIR=/var/log/agi-mcp
AGI_MCP_LOG_LEVEL=info  # debug, info, warn, error

# Memory limits
AGI_MCP_MAX_MEMORY=512M

# Performance tuning
AGI_MCP_QUERY_LIMIT=1000
AGI_MCP_SESSION_TIMEOUT=3600000  # 1 hour in ms

# Custom paths
AGI_MCP_CONFIG_DIR=/etc/agi-mcp
AGI_MCP_HOOKS_DIR=/etc/agi-mcp/hooks
AGI_MCP_SUBAGENTS_DIR=/etc/agi-mcp/subagents
```

### Configuration File

Create `/etc/agi-mcp/config.json`:

```json
{
  "database": {
    "path": "/var/lib/agi-mcp/agi-mcp.db",
    "backup": {
      "enabled": true,
      "interval": "daily",
      "retention": 7
    }
  },
  "logging": {
    "level": "info",
    "directory": "/var/log/agi-mcp",
    "maxSize": "10M",
    "maxFiles": 10
  },
  "performance": {
    "queryLimit": 1000,
    "cacheSize": "100M",
    "connectionPool": 5
  },
  "security": {
    "enableAuditLog": true,
    "restrictTools": false,
    "allowedSources": ["user", "system"]
  },
  "subagents": {
    "loadBuiltIn": true,
    "loadCustom": true,
    "customPaths": [
      "/etc/agi-mcp/subagents",
      "~/.agi-mcp/subagents"
    ]
  }
}
```

Load configuration in code:

```typescript
import { readFileSync } from 'fs';

const configPath = process.env.AGI_MCP_CONFIG || '/etc/agi-mcp/config.json';
const config = JSON.parse(readFileSync(configPath, 'utf-8'));
```

## Security Considerations

### File Permissions

```bash
# Restrict application files
chmod 750 /opt/agi-mcp
chmod 640 /opt/agi-mcp/package.json

# Protect database
chmod 600 /var/lib/agi-mcp/agi-mcp.db

# Secure logs
chmod 640 /var/log/agi-mcp/*.log

# Protect configuration
chmod 600 /etc/agi-mcp/config.json
chmod 700 /etc/agi-mcp/hooks
```

### Database Security

```bash
# Encrypt database at rest
sudo apt-get install sqlcipher

# Use encrypted database
sqlcipher /var/lib/agi-mcp/agi-mcp.db
PRAGMA key = 'your-encryption-key';
```

### Network Security

If exposing MCP server over network:

```javascript
// Add authentication
const { Server } = require('@modelcontextprotocol/sdk');

const server = new Server({
  name: 'agi-mcp',
  version: '1.0.0',
  authentication: {
    type: 'bearer',
    verifyToken: async (token) => {
      // Verify token
      return isValidToken(token);
    }
  }
});
```

### Audit Logging

Enable audit logging:

```typescript
// Log all tool calls
const auditLog = (tool: string, args: any, user: string) => {
  const entry = {
    timestamp: new Date().toISOString(),
    tool,
    args,
    user,
    ip: getClientIP()
  };
  
  fs.appendFileSync(
    '/var/log/agi-mcp/audit.log',
    JSON.stringify(entry) + '\n'
  );
};
```

### Secrets Management

Never store secrets in code or config files:

```bash
# Use environment variables
export JWT_SECRET=$(openssl rand -hex 32)
export DB_ENCRYPTION_KEY=$(openssl rand -hex 32)

# Or use secrets manager
aws secretsmanager get-secret-value \
  --secret-id agi-mcp/production \
  --query SecretString \
  --output text
```

## Monitoring and Logging

### Health Checks

```typescript
// health-check.ts
import Database from 'better-sqlite3';

export const healthCheck = () => {
  try {
    const db = new Database(process.env.AGI_MCP_DB_PATH);
    const result = db.prepare('SELECT 1').get();
    db.close();
    
    return {
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
};
```

### Prometheus Metrics

```typescript
import { register, Counter, Histogram } from 'prom-client';

// Tool call metrics
const toolCalls = new Counter({
  name: 'agi_mcp_tool_calls_total',
  help: 'Total number of tool calls',
  labelNames: ['tool', 'status']
});

// Response time
const responseTime = new Histogram({
  name: 'agi_mcp_response_time_seconds',
  help: 'Tool response time in seconds',
  labelNames: ['tool']
});

// Export metrics
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

### Log Rotation

Using `logrotate`:

```bash
# /etc/logrotate.d/agi-mcp
/var/log/agi-mcp/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 640 agi-mcp agi-mcp
    sharedscripts
    postrotate
        systemctl reload agi-mcp > /dev/null 2>&1 || true
    endscript
}
```

### Application Logging

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.AGI_MCP_LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: '/var/log/agi-mcp/error.log',
      level: 'error'
    }),
    new winston.transports.File({
      filename: '/var/log/agi-mcp/combined.log'
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## Backup and Recovery

### Automated Backups

```bash
#!/bin/bash
# /opt/agi-mcp/scripts/backup.sh

BACKUP_DIR=/var/lib/agi-mcp/backups
DB_PATH=/var/lib/agi-mcp/agi-mcp.db
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=7

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup database
sqlite3 "$DB_PATH" ".backup '$BACKUP_DIR/agi-mcp-$TIMESTAMP.db'"

# Compress backup
gzip "$BACKUP_DIR/agi-mcp-$TIMESTAMP.db"

# Remove old backups
find "$BACKUP_DIR" -name "agi-mcp-*.db.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: agi-mcp-$TIMESTAMP.db.gz"
```

Schedule with cron:
```bash
# Daily at 2 AM
0 2 * * * /opt/agi-mcp/scripts/backup.sh >> /var/log/agi-mcp/backup.log 2>&1
```

### Restore from Backup

```bash
#!/bin/bash
# /opt/agi-mcp/scripts/restore.sh

BACKUP_FILE=$1
DB_PATH=/var/lib/agi-mcp/agi-mcp.db

if [ -z "$BACKUP_FILE" ]; then
  echo "Usage: $0 <backup-file>"
  exit 1
fi

# Stop service
systemctl stop agi-mcp

# Backup current database
cp "$DB_PATH" "$DB_PATH.pre-restore"

# Restore
gunzip -c "$BACKUP_FILE" > "$DB_PATH"

# Verify integrity
sqlite3 "$DB_PATH" "PRAGMA integrity_check;"

# Restart service
systemctl start agi-mcp

echo "Restore completed from $BACKUP_FILE"
```

### Disaster Recovery

1. **Database Corruption**:
```bash
# Try to recover
sqlite3 agi-mcp.db "PRAGMA integrity_check;"
sqlite3 agi-mcp.db ".recover" | sqlite3 recovered.db

# Restore from latest backup
./scripts/restore.sh backups/agi-mcp-latest.db.gz
```

2. **Data Loss Prevention**:
```bash
# Enable WAL mode for better durability
sqlite3 agi-mcp.db "PRAGMA journal_mode=WAL;"

# Regular checkpoints
sqlite3 agi-mcp.db "PRAGMA wal_checkpoint(FULL);"
```

## Performance Tuning

### Database Optimization

```sql
-- Optimize query performance
PRAGMA journal_mode=WAL;
PRAGMA synchronous=NORMAL;
PRAGMA cache_size=10000;
PRAGMA temp_store=MEMORY;
PRAGMA mmap_size=30000000000;

-- Regular maintenance
VACUUM;
ANALYZE;
REINDEX;
```

### Memory Configuration

```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 dist/index.js

# PM2 configuration
pm2 start dist/index.js --max-memory-restart 500M
```

### Query Optimization

```typescript
// Use prepared statements
const stmt = db.prepare('SELECT * FROM goals WHERE status = ?');
const active = stmt.all('active');

// Limit results
const recent = db.prepare('SELECT * FROM observations ORDER BY timestamp DESC LIMIT ?');
const data = recent.all(100);

// Use indices effectively
db.exec('CREATE INDEX IF NOT EXISTS idx_goals_priority_status ON goals(priority, status)');
```

## Troubleshooting

### Check Service Status

```bash
# Systemd
systemctl status agi-mcp

# PM2
pm2 status agi-mcp
pm2 logs agi-mcp --lines 100
```

### Database Issues

```bash
# Check database integrity
sqlite3 /var/lib/agi-mcp/agi-mcp.db "PRAGMA integrity_check;"

# Check database size
du -h /var/lib/agi-mcp/agi-mcp.db

# Vacuum database
sqlite3 /var/lib/agi-mcp/agi-mcp.db "VACUUM;"
```

### Performance Issues

```bash
# Check memory usage
ps aux | grep node

# Check disk I/O
iostat -x 1

# Check database locks
sqlite3 agi-mcp.db "SELECT * FROM pragma_database_list;"
```

### Connection Issues

```bash
# Check if process is running
pgrep -f "agi-mcp"

# Check file permissions
ls -la /opt/agi-mcp/dist/index.js
ls -la /var/lib/agi-mcp/agi-mcp.db

# Test MCP connection
# (from MCP client configuration directory)
node /opt/agi-mcp/dist/index.js
```

### Log Analysis

```bash
# View recent errors
grep -i error /var/log/agi-mcp/*.log | tail -20

# Count errors by type
grep -i error /var/log/agi-mcp/*.log | cut -d: -f3 | sort | uniq -c

# Monitor logs in real-time
tail -f /var/log/agi-mcp/*.log
```

## Upgrade Procedure

```bash
# 1. Backup current installation
./scripts/backup.sh

# 2. Download new version
cd /tmp
git clone https://github.com/muah1987/AGI-MCP.git
cd AGI-MCP
git checkout vX.Y.Z

# 3. Build new version
npm ci --only=production
npm run build

# 4. Stop service
systemctl stop agi-mcp

# 5. Backup current version
sudo cp -r /opt/agi-mcp /opt/agi-mcp.backup

# 6. Install new version
sudo cp -r dist /opt/agi-mcp/
sudo cp package*.json /opt/agi-mcp/
sudo cp -r node_modules /opt/agi-mcp/

# 7. Set permissions
sudo chown -R agi-mcp:agi-mcp /opt/agi-mcp

# 8. Start service
systemctl start agi-mcp

# 9. Verify
systemctl status agi-mcp
pm2 logs agi-mcp --lines 50
```

## Related Documentation

- [Getting Started](GETTING_STARTED.md) - Installation basics
- [API Documentation](API.md) - Tool reference
- [Memory System](MEMORY_SYSTEM.md) - Database details
- [Architecture](../ARCHITECTURE.md) - System design

---

**AGI-MCP Deployment** - Production-ready deployment for MCP servers

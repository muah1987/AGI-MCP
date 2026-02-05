# AGI-MCP Getting Started Guide

## Overview

Welcome to AGI-MCP! This guide will help you install, configure, and start using the AGI-MCP server with the GOTCHA Framework, ATLAS Process, and Subagent System.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [MCP Client Setup](#mcp-client-setup)
- [First Steps](#first-steps)
- [Basic Examples](#basic-examples)
- [Common Workflows](#common-workflows)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Node.js**: Version 20 or higher
- **npm**: Version 9 or higher (comes with Node.js)
- **Operating System**: Linux, macOS, or Windows with WSL
- **Disk Space**: ~100 MB for installation, additional space for database

### Knowledge Requirements

- Basic command-line interface (CLI) usage
- Understanding of MCP (Model Context Protocol)
- Familiarity with JSON configuration

### Optional Requirements

- **MCP Client**: Claude Desktop, Cline, or compatible MCP client
- **Git**: For cloning the repository
- **SQLite Viewer**: For inspecting the database (optional)

## Installation

### Step 1: Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/muah1987/AGI-MCP.git
cd AGI-MCP

# Or via SSH
git clone git@github.com:muah1987/AGI-MCP.git
cd AGI-MCP
```

### Step 2: Install Dependencies

```bash
npm install
```

This installs:
- `@modelcontextprotocol/sdk` - MCP server framework
- `better-sqlite3` - SQLite database driver
- `gray-matter` - Frontmatter parser for subagents
- TypeScript and development dependencies

### Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### Step 4: Verify Installation

```bash
npm test
```

Expected output:
```
✓ Database initialized
✓ GOTCHA framework loaded
✓ ATLAS process loaded
✓ Memory infrastructure created
✓ Subagents registered
✓ All tests passed
```

## Quick Start

### Standalone Mode

Run AGI-MCP as a standalone server:

```bash
npm start
```

The server will:
1. Initialize memory infrastructure
2. Create `data/agi-mcp.db` database
3. Create `memory/` directory structure
4. Load all subagents
5. Start listening for MCP connections

### Verify Server is Running

```bash
# Check for database
ls -la data/agi-mcp.db

# Check memory infrastructure
ls -la memory/
# Should show: MEMORY.md, logs/

# Check logs
tail -f memory/logs/session-*.log
```

## MCP Client Setup

### Claude Desktop Configuration

1. **Locate Configuration File**:

```bash
# macOS
~/Library/Application Support/Claude/claude_desktop_config.json

# Linux
~/.config/Claude/claude_desktop_config.json

# Windows
%APPDATA%\Claude\claude_desktop_config.json
```

2. **Add AGI-MCP Server**:

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/AGI-MCP/dist/index.js"
      ],
      "description": "AGI-MCP Server with GOTCHA Framework and ATLAS Process"
    }
  }
}
```

**Important**: Replace `/absolute/path/to/AGI-MCP` with your actual installation path:

```bash
# Get absolute path
pwd
# Example output: /home/user/projects/AGI-MCP
```

3. **Restart Claude Desktop**

Fully quit and restart Claude Desktop to load the new configuration.

### Cline (VS Code Extension) Configuration

1. **Open VS Code Settings**
2. **Search for "MCP Servers"**
3. **Edit `settings.json`**:

```json
{
  "cline.mcpServers": {
    "agi-mcp": {
      "command": "node",
      "args": [
        "/absolute/path/to/AGI-MCP/dist/index.js"
      ]
    }
  }
}
```

4. **Reload VS Code**

### Other MCP Clients

For other MCP clients, refer to their documentation and use:
- **Command**: `node`
- **Arguments**: `["/path/to/AGI-MCP/dist/index.js"]`

## First Steps

### Step 1: Verify Connection

In your MCP client (e.g., Claude Desktop):

```
Hello! Can you list the available MCP tools?
```

Expected response should include:
- `set_goal`
- `observe`
- `think`
- `execute_command`
- `form_hypothesis`
- `assess_performance`
- `execute_atlas_task`
- `get_active_goals`
- `get_memory`
- `get_atlas_history`
- `process_goal_with_gotcha`
- `get_session_summary`

### Step 2: Set Your First Goal

```
Please set a goal to "Learn how to use AGI-MCP" with priority 8.
```

The system will:
1. Create goal in database
2. Assign unique ID
3. Set status to 'active'
4. Store with priority 8

### Step 3: Record an Observation

```
Record an observation: "User successfully installed AGI-MCP"
```

### Step 4: Execute Your First ATLAS Task

```
Execute an ATLAS task with ID "welcome-001" to "Explore AGI-MCP capabilities"
```

The system will execute all 5 ATLAS steps:
1. **Analyze**: Assess task complexity
2. **Task Breakdown**: Decompose into subtasks
3. **Learn**: Gather knowledge and resources
4. **Act**: Execute planned actions
5. **Synthesize**: Integrate results and learnings

### Step 5: Get Session Summary

```
Can you show me a summary of this session?
```

This displays:
- Session start time
- Active goals
- Observations recorded
- Thoughts captured
- Commands executed
- ATLAS tasks completed

## Basic Examples

### Example 1: Goal-Driven Development

```
# Set a goal
Set a goal to "Create a REST API for user management" with priority 9

# Record initial observations
Observe: "Project uses Express.js framework"
Observe: "Database is PostgreSQL"

# Think through the approach
Think: "Need to create models, routes, and controllers" with reasoning "Following MVC pattern"

# Form a hypothesis
Form hypothesis: "API will handle 1000 req/sec" with prediction "Based on Express benchmarks" and confidence 0.75

# Execute commands
Execute command: "create_user_model" with parameters {"fields": ["name", "email", "password"]}
Execute command: "create_user_routes"

# Assess performance
Assess performance: "User API created successfully" with score 0.9 and learnings "Consider adding rate limiting"
```

### Example 2: Using ATLAS Process

```
Execute ATLAS task "implement-auth" to "Implement JWT authentication"
```

The system automatically:

**Analyze**:
- Complexity: Medium
- Requirements: JWT library, auth middleware, user model
- Estimated time: 4 hours

**Task Breakdown**:
1. Install JWT library
2. Create auth middleware
3. Add login endpoint
4. Add token verification
5. Write tests

**Learn**:
- Required knowledge: JWT specs, security best practices
- Resources: jwt.io, OWASP guidelines
- Capabilities: Has Express, needs JWT library

**Act**:
- Execute each subtask systematically
- Log progress and results

**Synthesize**:
- Integrate results
- Capture learnings
- Assess performance

### Example 3: Using Subagents

```
# Explore codebase
Execute subagent "explore" to "Find all authentication-related files"

# Execute tests
Execute subagent "task-executor" to "Run all unit tests and report results"

# Review code
Execute subagent "code-reviewer" to "Review authentication module for security issues"

# Complex implementation
Execute subagent "general-purpose" to "Implement password reset functionality with email verification"
```

### Example 4: Complete Workflow

```
# 1. Set the goal
Set a goal to "Add API rate limiting" with priority 8

# 2. Explore the codebase
Execute subagent "explore" to "Identify where API routes are defined"

# 3. Research and plan
Think: "Will use express-rate-limit middleware" with reasoning "Popular, well-maintained, easy to configure"

# 4. Form hypothesis
Form hypothesis: "Rate limiting will reduce server load by 30%" with confidence 0.7

# 5. Execute ATLAS task
Execute ATLAS task "rate-limit-001" to "Implement rate limiting on all API endpoints"

# 6. Test implementation
Execute subagent "task-executor" to "Test rate limiting with load testing tool"

# 7. Code review
Execute subagent "code-reviewer" to "Review rate limiting implementation"

# 8. Assess results
Assess performance: "Rate limiting implemented and tested" with score 0.95 and learnings "Consider per-user rate limits for better UX"

# 9. Check session summary
Get session summary
```

## Common Workflows

### Workflow 1: Research and Documentation

```bash
# Goal: Research a topic and create documentation

1. Set goal: "Research GraphQL best practices"
2. Execute explore subagent: "Find existing GraphQL implementations in codebase"
3. Think: Record research findings and insights
4. Execute general-purpose subagent: "Create documentation for GraphQL best practices"
5. Execute code-reviewer subagent: "Review documentation for completeness"
6. Assess: Evaluate documentation quality
```

### Workflow 2: Feature Implementation

```bash
# Goal: Implement a new feature

1. Set goal: "Implement feature X"
2. Observe: Record requirements and constraints
3. Execute ATLAS task: "Implement feature X" (auto-executes 5 steps)
4. Execute task-executor subagent: "Run tests for feature X"
5. Execute code-reviewer subagent: "Review feature X implementation"
6. Form hypothesis: Predict performance/impact
7. Assess: Evaluate implementation quality
```

### Workflow 3: Debugging and Fixing

```bash
# Goal: Fix a bug

1. Set goal: "Fix authentication bug"
2. Observe: "Users unable to login with valid credentials"
3. Execute explore subagent: "Find authentication code and recent changes"
4. Think: Analyze potential causes
5. Execute general-purpose subagent: "Debug and fix authentication issue"
6. Execute task-executor subagent: "Run integration tests"
7. Assess: Evaluate fix effectiveness
```

### Workflow 4: Performance Optimization

```bash
# Goal: Optimize performance

1. Set goal: "Reduce API response time by 50%"
2. Execute task-executor subagent: "Run performance benchmarks"
3. Observe: Record benchmark results
4. Execute explore subagent: "Identify performance bottlenecks"
5. Think: Plan optimization strategy
6. Execute ATLAS task: "Optimize identified bottlenecks"
7. Execute task-executor subagent: "Re-run benchmarks"
8. Form hypothesis: Predict improvement impact
9. Assess: Compare before/after metrics
```

## Troubleshooting

### Issue: Server Won't Start

**Symptoms**:
```
Error: Cannot find module './dist/index.js'
```

**Solution**:
```bash
# Rebuild the project
npm run build

# Verify dist/ exists
ls -la dist/index.js
```

### Issue: Database Not Created

**Symptoms**:
- No `data/agi-mcp.db` file
- Errors about missing tables

**Solution**:
```bash
# Ensure data/ directory exists
mkdir -p data

# Remove corrupted database (if exists)
rm -f data/agi-mcp.db

# Restart server (will recreate)
npm start
```

### Issue: MCP Client Can't Connect

**Symptoms**:
- Tools not appearing in MCP client
- Connection errors

**Solution**:

1. **Check configuration file path**:
```bash
# Verify absolute path
pwd
# Use this path in config
```

2. **Validate JSON syntax**:
```bash
# Use JSON validator or
cat claude_desktop_config.json | python -m json.tool
```

3. **Check file permissions**:
```bash
chmod +x dist/index.js
```

4. **Verify Node.js version**:
```bash
node --version
# Should be v20 or higher
```

5. **Restart MCP client completely**

### Issue: Tools Not Working

**Symptoms**:
- Tool calls fail
- Unexpected errors

**Solution**:

1. **Check logs**:
```bash
tail -f memory/logs/session-*.log
```

2. **Verify database integrity**:
```bash
sqlite3 data/agi-mcp.db "PRAGMA integrity_check;"
```

3. **Check tool parameters**:
```
# Correct
set_goal: {goal: "My goal", priority: 8}

# Incorrect (missing required field)
set_goal: {priority: 8}
```

### Issue: Subagent Not Found

**Symptoms**:
```
Error: Subagent 'my-agent' not found
```

**Solution**:

1. **Check subagent file**:
```bash
# User-level
ls -la ~/.agi-mcp/subagents/

# Project-level
ls -la .agi-mcp/subagents/
```

2. **Verify frontmatter**:
```markdown
---
name: my-agent
description: Description here
---
System prompt here...
```

3. **Restart server** (subagents load on startup)

### Issue: Performance Slow

**Symptoms**:
- Slow responses
- High memory usage

**Solution**:

1. **Check database size**:
```bash
du -h data/agi-mcp.db
```

2. **Optimize database**:
```bash
sqlite3 data/agi-mcp.db "VACUUM; ANALYZE;"
```

3. **Limit query results**:
```
# Instead of
get_memory: {layer: "observations"}

# Use
get_memory: {layer: "observations", limit: 50}
```

4. **Use faster subagent models**:
```yaml
# In custom subagent
model: haiku  # Instead of sonnet/opus
```

## Next Steps

### Learn Advanced Features

- **[Hook System](../ADVANCED.md#hook-system)** - Customize lifecycle events
- **[Thinking Mechanism](../ADVANCED.md#thinking-mechanism)** - Intelligent filtering
- **[Custom Subagents](AGENTS.md#creating-custom-subagents)** - Create specialists

### Explore the Architecture

- **[Architecture Guide](../ARCHITECTURE.md)** - System design
- **[Memory System](MEMORY_SYSTEM.md)** - Database details
- **[API Reference](API.md)** - Complete tool documentation

### Try Examples

```bash
# Explore example configurations
ls examples/

# Try example subagents
cp examples/subagents/*.md .agi-mcp/subagents/

# Review example workflows
cat examples/workflows/*.md
```

### Join the Community

- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share experiences
- **Contribute**: See [CONTRIBUTING.md](../CONTRIBUTING.md)

## Best Practices

### 1. Start with Clear Goals

```
✅ Good: "Implement JWT authentication with refresh tokens"
❌ Bad: "Do authentication stuff"
```

### 2. Use Appropriate Subagents

```
✅ Explore: For searching and understanding
✅ Task-Executor: For running tests/commands
✅ Code-Reviewer: After implementing changes
✅ General-Purpose: For complex multi-step tasks
```

### 3. Track Your Work

```
# Always connect work to goals
Set goal → Execute ATLAS task → Assess results
```

### 4. Review Memory Regularly

```
# Check what's been done
Get active goals
Get session summary

# Review specific layers
Get memory: {layer: "assessments", limit: 10}
```

### 5. Maintain Database Health

```bash
# Weekly maintenance
sqlite3 data/agi-mcp.db "VACUUM; ANALYZE;"

# Monthly backup
cp data/agi-mcp.db backups/agi-mcp-$(date +%Y%m%d).db
```

## Quick Reference

### Essential Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `set_goal` | Define objective | `{goal: "...", priority: 8}` |
| `execute_atlas_task` | 5-step execution | `{task_id: "...", description: "..."}` |
| `execute_subagent` | Delegate to specialist | `{subagent: "explore", task: "..."}` |
| `get_session_summary` | Review session | `{}` |

### Directory Structure

```
AGI-MCP/
├── dist/              # Compiled JavaScript
├── src/               # TypeScript source
├── data/              # SQLite database
├── memory/            # Logs and documentation
├── .agi-mcp/          # Configuration (optional)
│   ├── hooks/
│   └── subagents/
└── examples/          # Example configurations
```

### Configuration Files

```
MCP Client Config:     claude_desktop_config.json
Hooks Config:          .agi-mcp/hooks-config.json
Custom Subagents:      .agi-mcp/subagents/*.md
```

## Getting Help

### Documentation

1. **This Guide** - Installation and basics
2. **[API.md](API.md)** - Complete tool reference
3. **[AGENTS.md](AGENTS.md)** - Subagent system
4. **[MEMORY_SYSTEM.md](MEMORY_SYSTEM.md)** - Database details
5. **[ADVANCED.md](../ADVANCED.md)** - Advanced features

### Support Channels

- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Questions and community support
- **Logs**: Check `memory/logs/` for debugging

### Useful Commands

```bash
# Check version
npm list agi-mcp-server

# Rebuild
npm run build

# Run tests
npm test

# View logs
tail -f memory/logs/session-*.log

# Inspect database
sqlite3 data/agi-mcp.db

# Backup database
cp data/agi-mcp.db backups/backup-$(date +%Y%m%d).db
```

---

**Welcome to AGI-MCP!** Start building AGI-like systems with the GOTCHA Framework and ATLAS Process.

For detailed examples and advanced usage, see [USAGE.md](../USAGE.md).

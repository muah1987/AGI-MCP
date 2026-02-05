# AGI-MCP Documentation

Welcome to the AGI-MCP documentation! This directory contains comprehensive guides for using and deploying the AGI-MCP server.

## 📚 Documentation Index

### Getting Started

- **[GETTING_STARTED.md](GETTING_STARTED.md)** - Installation, configuration, and first steps
  - Prerequisites and installation
  - MCP client setup (Claude Desktop, Cline)
  - Basic examples and common workflows
  - Troubleshooting guide

### Core Documentation

- **[API.md](API.md)** - Complete API reference for all 12 MCP tools
  - GOTCHA Framework tools (7 tools)
  - ATLAS Process tools (2 tools)
  - Memory Management tools (3 tools)
  - Input schemas, return types, and examples

- **[MEMORY_SYSTEM.md](MEMORY_SYSTEM.md)** - Memory architecture and database
  - Database schema and tables
  - GOTCHA layer storage
  - ATLAS process tracking
  - Query examples and optimization

- **[AGENTS.md](AGENTS.md)** - Subagent system documentation
  - Built-in subagents (explore, general-purpose, task-executor, code-reviewer)
  - Creating custom subagents
  - Configuration and lifecycle
  - Best practices

### Deployment

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
  - MCP client configuration
  - Production deployment options (Docker, Kubernetes, PM2)
  - Security considerations
  - Monitoring and backup strategies

## 🚀 Quick Links

### For New Users
1. Start with [GETTING_STARTED.md](GETTING_STARTED.md)
2. Try the basic examples
3. Explore the [API.md](API.md) reference

### For Developers
1. Review [MEMORY_SYSTEM.md](MEMORY_SYSTEM.md) for database details
2. Read [AGENTS.md](AGENTS.md) to create custom subagents
3. Check [API.md](API.md) for tool integration

### For DevOps
1. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
2. Review security considerations
3. Set up monitoring and backups

## 📖 Additional Resources

- **[../README.md](../README.md)** - Project overview and features
- **[../ARCHITECTURE.md](../ARCHITECTURE.md)** - System architecture
- **[../ADVANCED.md](../ADVANCED.md)** - Advanced features (hooks, thinking mechanism)
- **[../USAGE.md](../USAGE.md)** - Comprehensive usage guide
- **[../QUICKREF.md](../QUICKREF.md)** - Quick reference

## 🏗️ AGI-MCP Overview

AGI-MCP is a comprehensive MCP server implementing:

- **GOTCHA Framework** - 6-layer cognitive architecture
  - Goals, Observations, Thoughts, Commands, Hypotheses, Assessments

- **ATLAS Process** - 5-step task execution methodology
  - Analyze, Task Breakdown, Learn, Act, Synthesize

- **Subagent System** - Specialized AI assistants
  - 4 built-in subagents + custom subagent support

- **Memory System** - Persistent SQLite storage
  - Full GOTCHA and ATLAS history
  - Session tracking and analytics

- **Hook System** - Lifecycle customization
  - 11 hook events for automation

## 🔧 Tools Summary

| Category | Tools | Purpose |
|----------|-------|---------|
| GOTCHA Framework | 7 tools | Cognitive operations (goals, observations, thoughts, commands, hypotheses, assessments, full processing) |
| ATLAS Process | 2 tools | Task execution (execute task, get history) |
| Memory Management | 3 tools | Data retrieval (active goals, memory queries, session summary) |

**Total: 12 MCP Tools**

## 📝 Documentation Standards

All documentation follows these principles:
- **Comprehensive** - Detailed explanations with examples
- **Practical** - Real-world use cases and code samples
- **Organized** - Clear structure with table of contents
- **Consistent** - Uniform naming and formatting
- **Professional** - Production-ready guidance

## 🤝 Contributing

Found an issue or want to improve the documentation? See [../CONTRIBUTING.md](../CONTRIBUTING.md).

## 📄 License

AGI-MCP is licensed under the MIT License. See [../LICENSE](../LICENSE) for details.

---

**AGI-MCP** - Building towards Artificial General Intelligence through Model Context Protocol

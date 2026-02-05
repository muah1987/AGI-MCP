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

- **[API.md](API.md)** - Complete API reference for all 16 MCP tools
  - GOTCHA Framework tools (7 tools)
  - ATLAS Process tools (2 tools)
  - Memory Management tools (3 tools)
  - Skill System tools (2 tools)
  - Subagent tools (2 tools)
  - Input schemas, return types, and examples

- **[MEMORY_SYSTEM.md](MEMORY_SYSTEM.md)** - Memory architecture and database
  - Database schema and tables
  - GOTCHA layer storage
  - ATLAS process tracking
  - Query examples and optimization

- **[AGENTS.md](AGENTS.md)** - Subagent system documentation
  - 10 specialized subagents (explore, debug-engineer, architect, etc.)
  - Creating custom subagents
  - Configuration and lifecycle
  - Best practices

- **[SKILLS.md](SKILLS.md)** - Skill system and orchestration
  - Built-in skills (problem-solver, atlas-orchestrator, gotcha-coordinator)
  - Trigger-based routing
  - Priority management
  - Human interaction controls

- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System architecture and design
  - GOTCHA Framework details
  - ATLAS Process integration
  - Thinking mechanism
  - Database architecture

- **[ADVANCED.md](ADVANCED.md)** - Advanced features
  - Hook system (11 lifecycle events)
  - Thinking mechanism internals
  - Custom subagent creation
  - Advanced configurations

- **[USAGE.md](USAGE.md)** - Comprehensive usage guide
  - Common workflows
  - Best practices
  - Examples and patterns
  - Troubleshooting

- **[QUICKREF.md](QUICKREF.md)** - Quick reference
  - Tool cheat sheet
  - Common commands
  - Configuration snippets

### Deployment

- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
  - MCP client configuration (Claude Desktop, Cline)
  - Docker deployment (Dockerfile, docker-compose)
  - Production deployment options (Kubernetes, PM2)
  - Security considerations
  - Monitoring and backup strategies
  - Testing with test-docker.sh script

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

- **Skill System** - Intelligent task orchestration
  - 4 built-in skills with trigger-based routing
  - Priority management and human interaction controls

- **Subagent System** - Specialized AI assistants
  - 10 specialized subagents (explore, debug-engineer, architect, etc.)
  - Custom subagent support

- **Memory System** - Persistent SQLite storage
  - Full GOTCHA and ATLAS history
  - Session tracking and analytics

- **Hook System** - Lifecycle customization
  - 11 hook events for automation
  - Command and prompt-based hooks

- **Thinking Mechanism** - Purpose-based filtering
  - Integrated into all agents
  - Safety and constraint validation

## 🔧 Tools Summary

| Category | Tools | Purpose |
|----------|-------|---------|
| GOTCHA Framework | 7 tools | Cognitive operations (goals, observations, thoughts, commands, hypotheses, assessments, full processing) |
| ATLAS Process | 2 tools | Task execution (execute task, get history) |
| Memory Management | 3 tools | Data retrieval (active goals, memory queries, session summary) |
| Skill System | 2 tools | Orchestration (execute skill, list skills) |
| Subagent System | 2 tools | Delegation (execute subagent, list subagents) |

**Total: 16 MCP Tools**

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

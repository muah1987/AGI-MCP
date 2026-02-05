# AGI-MCP: Advanced General Intelligence Model Context Protocol Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-green.svg)](https://nodejs.org/)

A comprehensive Model Context Protocol (MCP) server implementing AGI-like capabilities through the **GOTCHA Framework**, **ATLAS Process**, **Thinking Mechanism**, **Hook System**, and **Subagent Architecture** with integrated database memory for persistent state management.

## 🌟 Features

### 🎯 GOTCHA Framework (6-Layer Architecture)
A sophisticated cognitive architecture for agentic systems:

1. **Goals (G)** - Define and manage objectives with priorities
2. **Observations (O)** - Perceive and record environmental state
3. **Thoughts (T)** - Reason and plan based on observations
4. **Commands (C)** - Select and execute actions systematically
5. **Hypotheses (H)** - Form and validate predictions
6. **Assessments (A)** - Evaluate performance and capture learnings

### 🗺️ ATLAS Process (5-Step Methodology)
Structured task execution methodology:

1. **Analyze (A)** - Understand task context and complexity
2. **Task Breakdown (T)** - Decompose into manageable subtasks
3. **Learn (L)** - Gather necessary knowledge and resources
4. **Act (A)** - Execute planned actions systematically
5. **Synthesize (S)** - Integrate results and extract insights

### 🧠 Thinking Mechanism
Intelligent reasoning and filtering layer:

- **Prompt Evaluation** - Assesses relevance and safety of user inputs
- **Tool Use Validation** - Evaluates appropriateness of tool execution
- **Completion Assessment** - Determines when work is truly complete
- **Purpose-Based Filtering** - Aligns all actions with agent purpose

### 🔗 Hook System
Claude Code-style lifecycle hooks for customization:

- **11 Hook Events** - SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, SubagentStart/Stop, and more
- **Command & Prompt Hooks** - Both shell command and LLM-based evaluation
- **Decision Control** - Allow, deny, or modify operations dynamically
- **Context Injection** - Add information at key lifecycle points

### 🤖 Subagent System
Specialized AI assistants for focused tasks:

- **4 Built-in Subagents** - Explore, General-Purpose, Task-Executor, Code-Reviewer
- **Custom Subagents** - Create project or user-level specialists
- **Isolated Contexts** - Each subagent has its own memory and permissions
- **Tool Restrictions** - Fine-grained control over subagent capabilities
- **Resumable Sessions** - Continue previous subagent work

### 💾 Database Integration
Persistent memory as source of truth:

- **SQLite Database** - All operations persisted
- **Session Tracking** - Complete history and analytics
- **ATLAS History** - Full execution traces
- **Query Optimization** - Indexed for performance

### 🏗️ Memory Infrastructure
Automatic initialization and management:

- **Auto-Detection** - Checks for existing infrastructure
- **Directory Creation** - `memory/logs` and `data` structures
- **Schema Initialization** - Database setup on first run
- **Logging System** - Comprehensive session logs

## 📦 Installation

### Standard Installation

```bash
# Clone the repository
git clone https://github.com/muah1987/AGI-MCP.git
cd AGI-MCP

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Docker Installation

```bash
# Option 1: Pull from Docker Hub (recommended)
docker pull muah1987/agi-mcp:latest

# Option 2: Build locally
docker build -t agi-mcp:latest .

# Option 3: Use docker-compose
docker-compose build

# Run the test script to validate the build
./test-docker.sh
```

### Publishing to Docker Hub

#### Manual Publishing

```bash
# 1. Create .env file with your credentials
cp .env.example .env
# Edit .env and add your DOCKER_USERNAME and DOCKER_TOKEN

# 2. Build and push to Docker Hub
./push-docker.sh
```

#### Automated Publishing with GitHub Actions

The repository includes a GitHub Actions workflow that automatically builds and pushes Docker images to DockerHub on every push to the main branch or when a tag is created.

**Setup:**

1. Add the following secrets to your GitHub repository settings:
   - `DOCKER_LOGIN` - Your DockerHub username
   - `DOCKER_PASSWORD` - Your DockerHub password or access token

2. The workflow will automatically:
   - Build the Docker image using the Dockerfile
   - Tag it with `latest` and the version from `package.json`
   - Push it to DockerHub under `<your-username>/agi-mcp`

**Manual Trigger:**

You can also trigger the workflow manually from the Actions tab in GitHub.

## 🚀 Quick Start

### As MCP Server (Native)

Add to your MCP client configuration (e.g., Claude Desktop, Cline):

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "node",
      "args": ["/absolute/path/to/AGI-MCP/dist/index.js"]
    }
  }
}
```

### As MCP Server (Docker)

Using Docker for isolated deployment:

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

Or using locally built image:

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "docker",
      "args": ["run", "-i", "--rm", "agi-mcp:latest"]
    }
  }
}
```

### Direct Execution

```bash
# Native
npm start

# Docker
docker run -i agi-mcp:latest

# Docker Compose
docker-compose up
```

### First Session

On first run, AGI-MCP automatically:
1. Creates `memory/MEMORY.md` documentation
2. Sets up `memory/logs/` directory
3. Creates `data/` directory
4. Initializes SQLite database
5. Loads all subagents
6. Configures hook system

## 🛠️ Available Tools

### GOTCHA Framework (7 tools)
- `set_goal` - Define system objectives
- `observe` - Record environmental observations
- `think` - Capture reasoning processes
- `execute_command` - Execute and log commands
- `form_hypothesis` - Create predictions
- `assess_performance` - Evaluate and learn
- `process_goal_with_gotcha` - Full cycle processing

### ATLAS Process (2 tools)
- `execute_atlas_task` - Run complete 5-step process
- `get_atlas_history` - View task execution history

### Memory Management (3 tools)
- `get_active_goals` - List active objectives
- `get_memory` - Query memory by layer
- `get_session_summary` - Session overview

### Subagent Management (3 tools)
- `execute_subagent` - Delegate to specialist
- `resume_subagent` - Continue previous work
- `list_subagents` - View available subagents

## 📚 Documentation

### Core Documentation
- **[README.md](README.md)** - This file, project overview
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contribution guidelines
- **[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)** - Community standards
- **[SECURITY.md](SECURITY.md)** - Security policy and reporting
- **[CHANGELOG.md](CHANGELOG.md)** - Version history
- **[LICENSE](LICENSE)** - MIT License

### Technical Documentation (docs/)
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** - System architecture and design
- **[docs/ADVANCED.md](docs/ADVANCED.md)** - Thinking Mechanism, Hooks, and Subagents
- **[docs/USAGE.md](docs/USAGE.md)** - Comprehensive usage guide with examples
- **[docs/SKILLS.md](docs/SKILLS.md)** - Skill system and orchestration
- **[docs/QUICKREF.md](docs/QUICKREF.md)** - Quick reference for developers
- **[docs/AGENTS.md](docs/AGENTS.md)** - Subagent documentation
- **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** - Quickstart guide
- **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** - Deployment guide
- **[docs/API.md](docs/API.md)** - Complete API documentation
- **[docs/MEMORY_SYSTEM.md](docs/MEMORY_SYSTEM.md)** - Memory architecture
- **[docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md)** - Project statistics

## 🏗️ Architecture

```
AGI-MCP/
├── src/
│   ├── index.ts                 # Main MCP server
│   ├── database/
│   │   ├── memory-db.ts         # SQLite operations
│   │   └── infrastructure.ts     # Auto-initialization
│   ├── gotcha/
│   │   ├── framework.ts         # GOTCHA 6-layer system
│   │   └── thinking.ts          # Thinking mechanism
│   ├── atlas/
│   │   └── process.ts           # ATLAS 5-step process
│   ├── hooks/
│   │   └── hook-system.ts       # Lifecycle hooks
│   ├── subagents/
│   │   └── subagent-system.ts   # Subagent management
│   └── tools/
│       └── mcp-tools.ts         # MCP tool definitions
├── memory/                      # Memory system
│   ├── MEMORY.md               # Documentation
│   └── logs/                   # Session logs
├── data/                       # Database storage
│   └── agi-mcp.db             # SQLite database
└── .agi-mcp/                  # Configuration
    ├── hooks/                  # Hook scripts
    ├── subagents/             # Custom subagents
    └── hooks-config.json      # Hook configuration
```

## 💡 Examples

### Execute ATLAS Task
```typescript
await tools.handleToolCall('execute_atlas_task', {
  task_id: 'research-001',
  description: 'Research quantum computing applications'
});
```

### Use Subagent
```typescript
await tools.handleToolCall('execute_subagent', {
  subagent: 'code-reviewer',
  task: 'Review authentication module for security'
});
```

### Configure Hook
```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "execute_command",
      "hooks": [{
        "type": "command",
        "command": "./validate-command.sh"
      }]
    }]
  }
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Build project
npm run build
```

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔒 Security

See [SECURITY.md](SECURITY.md) for security policies and reporting vulnerabilities.

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history and changes.

## 🙏 Acknowledgments

- Model Context Protocol by Anthropic
- Inspired by AGI principles and cognitive architectures
- Built with TypeScript and SQLite

## 📧 Support

- Create an [Issue](https://github.com/muah1987/AGI-MCP/issues)
- Read the [Documentation](docs/)
- Check [Discussions](https://github.com/muah1987/AGI-MCP/discussions)

---

**AGI-MCP** - Building towards Artificial General Intelligence through Model Context Protocol

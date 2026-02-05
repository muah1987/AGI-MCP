# AGI-MCP Usage Guide

This guide provides detailed instructions on how to use the AGI-MCP server and its various features.

## Table of Contents

1. [Quick Start](#quick-start)
2. [GOTCHA Framework](#gotcha-framework)
3. [ATLAS Process](#atlas-process)
4. [MCP Tools](#mcp-tools)
5. [Memory System](#memory-system)
6. [Examples](#examples)

## Quick Start

### Installation

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

### Running the Server

#### As a Standalone Process
```bash
npm start
```

#### As an MCP Server
Update your MCP client configuration (e.g., `cline_mcp_settings.json` or Claude Desktop config):

```json
{
  "mcpServers": {
    "agi-mcp": {
      "command": "node",
      "args": ["/path/to/AGI-MCP/dist/index.js"]
    }
  }
}
```

## GOTCHA Framework

The GOTCHA Framework is a 6-layer architecture that processes information through:

### Layer 1: Goals (G)
Define what you want to achieve.

**Tool:** `set_goal`
```json
{
  "name": "set_goal",
  "arguments": {
    "goal": "Understand machine learning concepts",
    "priority": 8
  }
}
```

### Layer 2: Observations (O)
Record environmental state and inputs.

**Tool:** `observe`
```json
{
  "name": "observe",
  "arguments": {
    "observation": "User is asking about neural networks",
    "source": "user-query"
  }
}
```

### Layer 3: Thoughts (T)
Apply reasoning and planning.

**Tool:** `think`
```json
{
  "name": "think",
  "arguments": {
    "thought": "Should provide beginner-friendly explanation",
    "reasoning": "Based on user's query pattern and context"
  }
}
```

### Layer 4: Commands (C)
Execute actions.

**Tool:** `execute_command`
```json
{
  "name": "execute_command",
  "arguments": {
    "command": "search_knowledge_base",
    "parameters": {
      "topic": "neural networks",
      "depth": "beginner"
    }
  }
}
```

### Layer 5: Hypotheses (H)
Form predictions about outcomes.

**Tool:** `form_hypothesis`
```json
{
  "name": "form_hypothesis",
  "arguments": {
    "hypothesis": "User will understand better with visual examples",
    "prediction": "Engagement will increase by 50%",
    "confidence": 0.75
  }
}
```

### Layer 6: Assessments (A)
Evaluate performance and learn.

**Tool:** `assess_performance`
```json
{
  "name": "assess_performance",
  "arguments": {
    "assessment": "Explanation was well-received",
    "score": 0.9,
    "learnings": "Visual examples improve comprehension"
  }
}
```

### Complete GOTCHA Cycle

Process a goal through all layers at once:

**Tool:** `process_goal_with_gotcha`
```json
{
  "name": "process_goal_with_gotcha",
  "arguments": {
    "goal": "Help user learn Python programming",
    "priority": 7
  }
}
```

## ATLAS Process

The ATLAS Process is a 5-step methodology for executing tasks:

### Using ATLAS

**Tool:** `execute_atlas_task`
```json
{
  "name": "execute_atlas_task",
  "arguments": {
    "task_id": "learn-python-001",
    "description": "Create a comprehensive Python learning path for beginners"
  }
}
```

This will automatically:
1. **Analyze** - Assess task complexity and requirements
2. **Task Breakdown** - Decompose into subtasks
3. **Learn** - Gather necessary knowledge
4. **Act** - Execute each subtask
5. **Synthesize** - Integrate results and capture learnings

### Viewing ATLAS History

**Tool:** `get_atlas_history`
```json
{
  "name": "get_atlas_history",
  "arguments": {
    "task_id": "learn-python-001"
  }
}
```

## MCP Tools

### Memory Retrieval Tools

#### Get Active Goals
```json
{
  "name": "get_active_goals",
  "arguments": {}
}
```

#### Get Memory by Layer
```json
{
  "name": "get_memory",
  "arguments": {
    "layer": "thoughts",
    "limit": 50
  }
}
```

Valid layers:
- `goals`
- `observations`
- `thoughts`
- `commands`
- `hypotheses`
- `assessments`

#### Get Session Summary
```json
{
  "name": "get_session_summary",
  "arguments": {}
}
```

## Memory System

The AGI-MCP server uses a SQLite database as its source of truth. All operations are persisted.

### Memory Structure

```
data/
└── agi-mcp.db          # SQLite database

memory/
├── MEMORY.md           # Memory system documentation
└── logs/               # Session logs
    └── session-*.log   # Individual session logs
```

### Database Schema

- **goals** - All defined goals
- **observations** - Environmental observations
- **thoughts** - Reasoning processes
- **commands** - Executed commands
- **hypotheses** - Predictions
- **assessments** - Performance evaluations
- **atlas_steps** - ATLAS process history
- **memory** - Cross-layer memory entries
- **sessions** - Session tracking

### Automatic Initialization

On first run, the system automatically:
1. Checks if `memory/MEMORY.md` exists
2. Creates `memory/logs` directory
3. Creates `data` directory
4. Initializes the SQLite database
5. Creates initial log file

## Examples

### Example 1: Research Task

```json
// Define the goal
{
  "name": "set_goal",
  "arguments": {
    "goal": "Research quantum computing applications",
    "priority": 8
  }
}

// Execute with ATLAS
{
  "name": "execute_atlas_task",
  "arguments": {
    "task_id": "research-quantum-001",
    "description": "Research and summarize quantum computing applications in cryptography"
  }
}

// Get the results
{
  "name": "get_atlas_history",
  "arguments": {
    "task_id": "research-quantum-001"
  }
}
```

### Example 2: Problem Solving

```json
// Complete GOTCHA cycle
{
  "name": "process_goal_with_gotcha",
  "arguments": {
    "goal": "Debug authentication issue in web application",
    "priority": 9
  }
}

// Add specific observations
{
  "name": "observe",
  "arguments": {
    "observation": "Users report 401 errors after login",
    "source": "error-logs"
  }
}

// Record reasoning
{
  "name": "think",
  "arguments": {
    "thought": "Likely token expiration issue",
    "reasoning": "Pattern matches previous JWT problems"
  }
}

// Form hypothesis
{
  "name": "form_hypothesis",
  "arguments": {
    "hypothesis": "Increasing token lifetime will resolve the issue",
    "prediction": "401 errors will decrease by 95%",
    "confidence": 0.8
  }
}

// Execute solution
{
  "name": "execute_command",
  "arguments": {
    "command": "update_jwt_config",
    "parameters": {
      "expiry": "3600s"
    }
  }
}

// Assess results
{
  "name": "assess_performance",
  "arguments": {
    "assessment": "Solution successfully resolved the issue",
    "score": 0.95,
    "learnings": "JWT token lifetime should be configurable"
  }
}
```

### Example 3: Learning Session

```json
// Start learning task
{
  "name": "execute_atlas_task",
  "arguments": {
    "task_id": "learn-ml-001",
    "description": "Learn fundamentals of machine learning including supervised and unsupervised learning"
  }
}

// Track progress
{
  "name": "observe",
  "arguments": {
    "observation": "Completed linear regression tutorial",
    "source": "learning-tracker"
  }
}

// Self-assess
{
  "name": "assess_performance",
  "arguments": {
    "assessment": "Good understanding of linear regression basics",
    "score": 0.75,
    "learnings": "Need more practice with feature engineering"
  }
}

// View all active learning goals
{
  "name": "get_active_goals",
  "arguments": {}
}
```

## Tips and Best Practices

1. **Use ATLAS for complex tasks** - The 5-step process ensures thorough execution
2. **Use GOTCHA for continuous monitoring** - Track goals, observations, and assessments
3. **Review session summaries** - Use `get_session_summary` to understand your session
4. **Check ATLAS history** - Review how tasks were executed and learn from patterns
5. **Set appropriate priorities** - Higher priority goals (8-10) get more attention
6. **Record learnings** - Use assessments to capture insights for future reference

## Troubleshooting

### Database Issues
If you encounter database errors, the database file is located at `data/agi-mcp.db`. You can delete it to reset.

### Memory Infrastructure
If memory infrastructure isn't created automatically, manually run:
```bash
mkdir -p memory/logs
mkdir -p data
```

### Build Issues
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Advanced Usage

### Custom Database Path
You can specify a custom database path when initializing the server programmatically.

### Integration with Other Systems
The MCP server can be integrated with any MCP-compatible client, including:
- Claude Desktop
- Cline VS Code Extension
- Custom MCP clients

## Support

For issues or questions, please refer to the main README.md or open an issue on GitHub.

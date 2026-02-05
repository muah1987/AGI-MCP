# AGI-MCP Server

A comprehensive Model Context Protocol (MCP) server that implements AGI-like capabilities using the **GOTCHA Framework** and **ATLAS Process**, with integrated database memory for persistent state management.

## Features

### 🎯 GOTCHA Framework (6-Layer Architecture)
A sophisticated 6-layer architecture for agentic systems:

1. **Goals (G)** - Define and manage objectives and intentions
2. **Observations (O)** - Perceive and record environmental state
3. **Thoughts (T)** - Reason and plan based on observations
4. **Commands (C)** - Select and execute actions
5. **Hypotheses (H)** - Form predictions about outcomes
6. **Assessments (A)** - Evaluate performance and learn

### 🗺️ ATLAS Process (5-Step Methodology)
A structured 5-step process for task execution:

1. **Analyze (A)** - Understand the task and context
2. **Task Breakdown (T)** - Decompose into manageable subtasks
3. **Learn (L)** - Gather necessary knowledge and resources
4. **Act (A)** - Execute the planned actions
5. **Synthesize (S)** - Integrate results and learnings

### 💾 Database Integration
- **SQLite Database** - Serves as the source of truth for all operations
- **Persistent Memory** - All goals, observations, thoughts, commands, hypotheses, and assessments are stored
- **Session Tracking** - Complete session history and analytics
- **ATLAS History** - Full trace of task execution through all 5 steps

### 🧠 Memory Infrastructure
On first session in a new environment, the system automatically:
- Checks if `memory/MEMORY.md` exists
- Creates directory structure: `memory/logs` and `data`
- Initializes database schema
- Sets up logging infrastructure

## Installation

```bash
npm install
npm run build
```

## Usage

### As MCP Server

Add to your MCP client configuration:

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

### Direct Execution

```bash
npm start
```

## Available Tools

### GOTCHA Framework Tools

- **set_goal** - Define a new goal for the AGI system
- **observe** - Record an observation about the environment
- **think** - Record a thought or reasoning process
- **execute_command** - Execute a command and record it
- **form_hypothesis** - Form a hypothesis about expected outcomes
- **assess_performance** - Assess performance and record learnings
- **process_goal_with_gotcha** - Process a goal through all GOTCHA layers

### ATLAS Process Tools

- **execute_atlas_task** - Execute a complete task using the 5-step ATLAS process
- **get_atlas_history** - Retrieve ATLAS process history for a specific task

### Memory Tools

- **get_active_goals** - Retrieve all active goals from memory
- **get_memory** - Retrieve memory entries by layer
- **get_session_summary** - Get a summary of the current session

## Architecture

```
AGI-MCP/
├── src/
│   ├── index.ts              # Main MCP server
│   ├── database/
│   │   ├── memory-db.ts      # Database layer
│   │   └── infrastructure.ts  # Memory infrastructure initialization
│   ├── gotcha/
│   │   └── framework.ts      # GOTCHA Framework implementation
│   ├── atlas/
│   │   └── process.ts        # ATLAS Process implementation
│   └── tools/
│       └── mcp-tools.ts      # MCP tool definitions and handlers
├── memory/
│   ├── MEMORY.md             # Memory system documentation
│   └── logs/                 # Session logs
├── data/
│   └── agi-mcp.db           # SQLite database (created on first run)
└── package.json
```

## Example: Using the ATLAS Process

```javascript
// Through MCP tool call
{
  "name": "execute_atlas_task",
  "arguments": {
    "task_id": "task-001",
    "description": "Analyze user query and provide comprehensive response"
  }
}
```

The ATLAS process will:
1. **Analyze** the task and assess complexity
2. **Break down** the task into subtasks
3. **Learn** by gathering required knowledge
4. **Act** by executing each subtask
5. **Synthesize** results and capture learnings

## Example: Using the GOTCHA Framework

```javascript
// Set a goal
{
  "name": "set_goal",
  "arguments": {
    "goal": "Understand user requirements",
    "priority": 8
  }
}

// Process the goal through all layers
{
  "name": "process_goal_with_gotcha",
  "arguments": {
    "goal": "Understand user requirements",
    "priority": 8
  }
}
```

## Database Schema

The system maintains several tables:
- `goals` - Goal definitions and status
- `observations` - Environmental observations
- `thoughts` - Reasoning processes
- `commands` - Executed commands
- `hypotheses` - Predictions and validations
- `assessments` - Performance evaluations
- `atlas_steps` - ATLAS process execution history
- `memory` - Cross-layer memory entries
- `sessions` - Session tracking

## Development

### Build
```bash
npm run build
```

### Project Structure
The codebase follows a modular architecture:
- **Database Layer** - Handles all persistence
- **GOTCHA Layer** - Implements the 6-layer framework
- **ATLAS Layer** - Implements the 5-step process
- **Tools Layer** - Exposes MCP tools
- **Server Layer** - MCP server implementation

## License

MIT

## Contributing

Contributions are welcome! This is a comprehensive AGI-oriented MCP server that can be extended with additional tools and capabilities.

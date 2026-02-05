# AGI-MCP Quick Reference

## Installation & Setup

```bash
npm install
npm run build
npm test        # Run tests
npm start       # Start server
```

## Directory Structure

```
AGI-MCP/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main MCP server entry point
│   ├── database/          # Database layer
│   │   ├── memory-db.ts   # SQLite database operations
│   │   └── infrastructure.ts  # Memory infrastructure init
│   ├── gotcha/            # GOTCHA Framework
│   │   └── framework.ts   # 6-layer architecture
│   ├── atlas/             # ATLAS Process
│   │   └── process.ts     # 5-step methodology
│   └── tools/             # MCP Tools
│       └── mcp-tools.ts   # Tool definitions & handlers
├── memory/                # Memory system
│   ├── MEMORY.md         # Documentation
│   └── logs/             # Session logs
├── data/                 # Database storage
│   └── agi-mcp.db       # SQLite database (auto-created)
└── dist/                # Compiled JavaScript (auto-generated)
```

## GOTCHA Framework (6 Layers)

| Layer | Purpose | Tool |
|-------|---------|------|
| **G**oals | Define objectives | `set_goal` |
| **O**bservations | Record state | `observe` |
| **T**houghts | Reason & plan | `think` |
| **C**ommands | Execute actions | `execute_command` |
| **H**ypotheses | Predict outcomes | `form_hypothesis` |
| **A**ssessments | Evaluate & learn | `assess_performance` |

## ATLAS Process (5 Steps)

1. **A**nalyze - Understand task & context
2. **T**ask Breakdown - Decompose into subtasks
3. **L**earn - Gather knowledge
4. **A**ct - Execute actions
5. **S**ynthesize - Integrate results

**Tool:** `execute_atlas_task`

## Available MCP Tools

### GOTCHA Tools
- `set_goal` - Define a goal
- `observe` - Record observation
- `think` - Record thought/reasoning
- `execute_command` - Execute command
- `form_hypothesis` - Form hypothesis
- `assess_performance` - Assess & learn
- `process_goal_with_gotcha` - Full GOTCHA cycle

### ATLAS Tools
- `execute_atlas_task` - Run full ATLAS process
- `get_atlas_history` - Get task execution history

### Memory Tools
- `get_active_goals` - List active goals
- `get_memory` - Get memory by layer
- `get_session_summary` - Session summary

## Memory Layers

Available layers for `get_memory`:
- `goals`
- `observations`
- `thoughts`
- `commands`
- `hypotheses`
- `assessments`

## Database Tables

- `goals` - Goal definitions
- `observations` - Environmental observations
- `thoughts` - Reasoning processes
- `commands` - Executed commands
- `hypotheses` - Predictions
- `assessments` - Performance evaluations
- `atlas_steps` - ATLAS execution history
- `memory` - Cross-layer entries
- `sessions` - Session tracking

## Quick Examples

### Define a Goal
```json
{
  "name": "set_goal",
  "arguments": {
    "goal": "Learn TypeScript",
    "priority": 8
  }
}
```

### Execute ATLAS Task
```json
{
  "name": "execute_atlas_task",
  "arguments": {
    "task_id": "task-001",
    "description": "Research and summarize TypeScript best practices"
  }
}
```

### Get Session Summary
```json
{
  "name": "get_session_summary",
  "arguments": {}
}
```

## Configuration

### MCP Client Setup

Add to your MCP configuration file:

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

## Key Features

✓ Automatic memory infrastructure initialization
✓ Persistent SQLite database
✓ Session tracking
✓ Comprehensive logging
✓ 12 MCP tools
✓ GOTCHA Framework (6 layers)
✓ ATLAS Process (5 steps)
✓ Zero configuration required

## Development

### Add New Tool

1. Add tool definition in `src/tools/mcp-tools.ts` → `getToolDefinitions()`
2. Add handler in `src/tools/mcp-tools.ts` → `handleToolCall()`
3. Rebuild: `npm run build`

### Add New Database Table

1. Update schema in `src/database/memory-db.ts` → `initializeSchema()`
2. Add methods for CRUD operations
3. Rebuild and test

### Run Tests

```bash
npm test
```

Tests verify:
- Memory infrastructure
- Database operations
- GOTCHA Framework (all 6 layers)
- ATLAS Process (all 5 steps)
- Memory retrieval
- Session management

## Troubleshooting

**Build fails:** `rm -rf dist node_modules && npm install`

**Database issues:** Delete `data/agi-mcp.db` to reset

**Memory not initialized:** Manually create `memory/logs` and `data` directories

## Resources

- README.md - Full documentation
- USAGE.md - Comprehensive usage guide
- example-mcp-config.json - Example MCP configuration
- src/test.ts - Test suite examples

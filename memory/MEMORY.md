# AGI-MCP Memory System

## Overview
This memory system serves as the foundation for the AGI-MCP server, providing persistent storage and retrieval of goals, observations, thoughts, commands, hypotheses, and assessments.

## Structure

### Memory Layers (GOTCHA Framework)
1. **Goals** - System objectives and user intents
2. **Observations** - Environmental state and inputs
3. **Thoughts** - Reasoning processes and plans
4. **Commands** - Executed actions and their parameters
5. **Hypotheses** - Predictions and expected outcomes
6. **Assessments** - Performance evaluations and learnings

### Memory Storage
- **Database**: SQLite database (`data/agi-mcp.db`) - Primary source of truth
- **Logs**: Session logs in `memory/logs/`
- **Schemas**: Defined in database initialization

## ATLAS Process Integration
The 5-step ATLAS process is tracked in memory:
1. **Analyze** - Task understanding and context
2. **Task Breakdown** - Subtask decomposition
3. **Learn** - Knowledge acquisition
4. **Act** - Action execution
5. **Synthesize** - Result integration

## Usage
Memory is automatically initialized on first run if it doesn't exist.
All operations are logged and stored in the database for future reference.

## Last Updated
Created: {{ timestamp }}

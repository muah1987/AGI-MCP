# AGI-MCP Configuration Directory

This directory contains AGI-MCP server configurations, skills, agents, and validation hooks.

## Directory Structure

```
.agi-mcp/
├── skills/              # Skills for task orchestration
│   ├── plan-with-team.md  # Team planning skill
│   ├── plan.md           # Quick planning skill
│   ├── build.md          # Plan implementation skill
│   ├── github.md         # GitHub operations skill
│   └── playwright.md     # Browser automation skill
├── agents/              # Specialized agent configurations
│   └── team/           # Team member definitions
└── hooks/              # Lifecycle hooks
    └── validators/     # Validation scripts for skills
```

## Skills

Skills in `.agi-mcp/skills/` are automatically loaded by the AGI-MCP server.

### Available Skills

- **plan-with-team.md** - Creates detailed implementation plans with team orchestration
- **plan.md** - Quick engineering implementation plans
- **build.md** - Implements plans from specification files
- **github.md** - Comprehensive GitHub operations (30+ actions)
- **playwright.md** - Browser automation and web testing

## Agents

Team member agents can be defined in `.agi-mcp/agents/team/` and will be available for the plan-with-team skill to orchestrate.

## Hooks

### Validators

- **validate_new_file.py** - Checks if a new file was created in specified directory
- **validate_file_contains.py** - Validates that files contain required sections

These validators are used by the plan-with-team skill to ensure plan documents meet specifications.

## Usage

The plan-with-team skill can be executed via MCP:

```typescript
await tools.handleToolCall('execute_skill', {
  skill_name: 'plan-with-team',
  context: {
    user_prompt: 'Implement user authentication system',
    orchestration_prompt: 'Use security-focused approach'
  }
});
```

## Compatibility

This is the native AGI-MCP configuration structure. All skills, agents, and hooks are centralized in this directory for maximum efficiency and maintainability.

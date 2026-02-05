# AGI-MCP Claude Code Integration

This directory contains Claude Code-compatible configurations for the AGI-MCP server.

## Directory Structure

```
.claude/
├── skills/              # Skills for task orchestration
│   └── plan-with-team.md  # Team planning skill
├── agents/              # Specialized agent configurations
│   └── team/           # Team member definitions
└── hooks/              # Lifecycle hooks
    └── validators/     # Validation scripts for skills
```

## Skills

Skills in `.claude/skills/` are automatically loaded by the AGI-MCP server alongside skills from `.agi-mcp/skills/`.

### Available Skills

- **plan-with-team.md** - Creates detailed implementation plans based on user requirements

## Agents

Team member agents can be defined in `.claude/agents/team/` and will be available for the plan-with-team skill to orchestrate.

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

This structure is compatible with both:
- AGI-MCP native skill system (`.agi-mcp/skills/`)
- Claude Code skill format (`.claude/skills/`)

Files are duplicated in both locations for maximum compatibility.

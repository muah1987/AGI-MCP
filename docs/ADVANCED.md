# AGI-MCP Advanced Features

This document describes the advanced features of the AGI-MCP server, including the Thinking Mechanism, Hook System, and Subagent capabilities.

## Table of Contents

1. [Thinking Mechanism](#thinking-mechanism)
2. [Hook System](#hook-system)
3. [Subagent System](#subagent-system)
4. [Integration](#integration)

## Thinking Mechanism

The Thinking Mechanism provides a reasoning and filtering layer that evaluates prompts, jobs, and actions based on agent purpose and context. It acts as a cognitive filter for all operations.

### Purpose

- **Filter prompts** based on relevance to agent purpose
- **Evaluate tool usage** for safety and appropriateness  
- **Assess completion** to determine if work is done
- **Provide reasoning** for all decisions

### Key Features

#### 1. Prompt Evaluation
```typescript
const result = await thinkingMechanism.evaluatePrompt(userPrompt);
// Returns: { should Proceed, confidence, reasoning, warnings }
```

Analyzes prompts for:
- Relevance to agent purpose
- Safety concerns
- Alignment with active goals
- Potential risks

#### 2. Tool Use Evaluation
```typescript
const result = await thinkingMechanism.evaluateToolUse(toolName, toolInput);
// Returns: { shouldProceed, confidence, reasoning, modifications, warnings }
```

Checks:
- Tool alignment with purpose
- Constraint violations
- Risk level assessment
- Input modifications needed

#### 3. Completion Assessment
```typescript
const result = await thinkingMechanism.evaluateCompletion(context);
// Returns: { shouldProceed, confidence, reasoning, warnings }
```

Determines:
- Whether goals are achieved
- Quality of output
- Remaining work items
- Need to continue or stop

### Configuration

The thinking mechanism is initialized with a context:

```typescript
const context: ThinkingContext = {
  purpose: 'Provide safe, helpful assistance with code',
  constraints: ['No external network access', 'Read-only mode'],
  priorities: ['Safety', 'Accuracy', 'Efficiency'],
  currentGoals: [],
  recentObservations: []
};

const thinking = new ThinkingMechanism(db, gotcha, context);
```

## Hook System

The Hook System implements Claude Code-style lifecycle hooks that run at specific points during execution. Hooks enable you to:

- **Validate operations** before they execute
- **Add context** to conversations
- **Block unsafe actions**
- **Customize behavior** at key lifecycle points

### Supported Hook Events

| Event | When it fires | Can block |
|-------|--------------|-----------|
| `SessionStart` | Session begins | No |
| `UserPromptSubmit` | User submits prompt | Yes |
| `PreToolUse` | Before tool execution | Yes |
| `PermissionRequest` | Permission dialog shown | Yes |
| `PostToolUse` | After tool completes | No |
| `Stop` | Agent finishes responding | Yes |
| `SubagentStart` | Subagent spawns | No |
| `SubagentStop` | Subagent finishes | Yes |
| `SessionEnd` | Session terminates | No |
| `Notification` | Notification sent | No |

### Hook Types

#### 1. Command-Based Hooks
Execute shell commands with JSON input/output:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "execute_command",
        "hooks": [
          {
            "type": "command",
            "command": "./scripts/validate-command.sh",
            "timeout": 30000
          }
        ]
      }
    ]
  }
}
```

#### 2. Prompt-Based Hooks
Use the thinking mechanism for intelligent evaluation:

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Evaluate if work is complete: $ARGUMENTS"
          }
        ]
      }
    ]
  }
}
```

### Hook Input/Output

#### Input Format
All hooks receive JSON via stdin:
```json
{
  "session_id": "abc123",
  "cwd": "/path/to/project",
  "permission_mode": "default",
  "hook_event_name": "PreToolUse",
  "tool_name": "execute_command",
  "tool_input": { "command": "npm test" }
}
```

#### Output Format
Hooks return JSON to control behavior:
```json
{
  "decision": "allow" | "deny" | "block",
  "reason": "Explanation for decision",
  "additionalContext": "Context to add",
  "updatedInput": { "modified": "parameters" },
  "continue": true | false
}
```

### Exit Codes

- **0**: Success, process stdout
- **2**: Blocking error, use stderr as error message
- **Other**: Non-blocking error, continue execution

### Integration with Thinking Mechanism

Prompt-based hooks automatically use the thinking mechanism:

```typescript
// Hook configuration
{
  type: "prompt",
  prompt: "Evaluate this tool use: $ARGUMENTS"
}

// Automatically routes to:
// - evaluatePrompt() for UserPromptSubmit
// - evaluateToolUse() for PreToolUse  
// - evaluateCompletion() for Stop/SubagentStop
```

## Subagent System

Subagents are specialized AI assistants that run in isolated contexts with custom prompts, tool restrictions, and permissions.

### Built-in Subagents

#### 1. Explore
- **Purpose**: Fast, read-only codebase analysis
- **Model**: Haiku (fast, low-cost)
- **Tools**: Memory retrieval only
- **Use**: Search, analyze, understand code

#### 2. General-Purpose
- **Purpose**: Complex multi-step tasks
- **Model**: Inherits from parent
- **Tools**: All tools available
- **Use**: Research, implementation, modifications

#### 3. Task-Executor
- **Purpose**: Command execution and testing
- **Model**: Haiku
- **Tools**: Command execution, memory
- **Use**: Run tests, build code, automate tasks

#### 4. Code-Reviewer
- **Purpose**: Code quality analysis
- **Model**: Inherits from parent
- **Tools**: Memory, thinking, assessment (no commands)
- **Use**: Review code for quality and security

### Creating Custom Subagents

Create a markdown file with YAML frontmatter:

```markdown
---
name: my-subagent
description: When to use this subagent
tools: get_memory, think, assess_performance
disallowedTools: execute_command
model: haiku
permissionMode: default
---

You are a specialized subagent for [purpose].

Your capabilities:
- Capability 1
- Capability 2

When invoked:
1. Step 1
2. Step 2
3. Step 3
```

Save to:
- `~/.agi-mcp/subagents/` for user-level (all projects)
- `.agi-mcp/subagents/` for project-level
- Plugin directories for shared subagents

### Using Subagents

#### Execute a Task
```typescript
const result = await subagentSystem.executeTask(
  'code-reviewer',
  'Review the authentication module for security issues'
);
```

#### Resume a Subagent
```typescript
const result = await subagentSystem.resumeInstance(
  instanceId,
  'Now check the authorization logic too'
);
```

#### Suggest a Subagent
```typescript
const suggestion = subagentSystem.suggestSubagent(
  'Find all API endpoints in the codebase'
);
// Returns: 'explore' subagent
```

### Subagent Lifecycle

1. **Creation**: Instance created with isolated context
2. **Execution**: ATLAS process runs the task
3. **Completion**: Results returned to parent
4. **Hooks**: SubagentStart and SubagentStop hooks fire
5. **Storage**: All activities logged to database

### Subagent Hooks

Subagents can define their own hooks in frontmatter:

```yaml
---
name: safe-executor
hooks:
  PreToolUse:
    - matcher: "execute_command"
      hooks:
        - type: command
          command: "./scripts/validate-safe-command.sh"
---
```

## Integration

### Complete Flow

1. **User submits prompt**
   - `UserPromptSubmit` hook fires
   - Thinking mechanism evaluates prompt
   - Hook can block or add context

2. **Agent selects tool**
   - `PreToolUse` hook fires
   - Thinking mechanism evaluates tool use
   - Hook can block, modify input, or allow

3. **Tool executes**
   - Tool performs action
   - Results captured

4. **Post-execution**
   - `PostToolUse` hook fires
   - Can add context or trigger actions

5. **Completion check**
   - `Stop` hook fires
   - Thinking mechanism assesses completion
   - Can force continuation if work incomplete

6. **Subagent delegation** (if needed)
   - `SubagentStart` hook fires
   - Subagent executes in isolation
   - `SubagentStop` hook fires on completion

### Example Workflow

```typescript
// Initialize systems
const thinking = new ThinkingMechanism(db, gotcha, context);
const hooks = new HookSystem(hookConfig, sessionId, cwd);
const subagents = new SubagentSystem(db, projectDir);

// Connect thinking to hooks
hooks.setThinkingMechanism(thinking);

// Load subagents
subagents.loadSubagents();

// Process user request
const promptResult = await hooks.onUserPromptSubmit(userPrompt);
if (!promptResult.allowed) {
  return { error: promptResult.reason };
}

// Evaluate tool use
const toolResult = await hooks.onPreToolUse(toolName, toolInput, toolId);
if (!toolResult.allowed) {
  return { error: toolResult.reason };
}

// Execute (possibly with subagent)
if (shouldDelegate) {
  await hooks.onSubagentStart(subagentId, subagentName);
  const result = await subagents.executeTask(subagentName, task);
  await hooks.onSubagentStop(subagentId, subagentName);
}

// Check completion
const stopResult = await hooks.onStop();
if (stopResult.shouldContinue) {
  // Continue working
}
```

## Configuration Files

### Hook Configuration
`.agi-mcp/hooks.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "execute_command",
        "hooks": [
          { "type": "command", "command": "./validate.sh" }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          { "type": "prompt", "prompt": "Check if complete" }
        ]
      }
    ]
  }
}
```

### Subagent Definition
`.agi-mcp/subagents/my-agent.md`:
```markdown
---
name: my-agent
description: Custom agent for specific tasks
tools: get_memory, think
model: haiku
---

System prompt for the subagent...
```

## Best Practices

### Thinking Mechanism
1. Define clear agent purposes
2. Set appropriate constraints
3. Update context regularly
4. Review thinking reasoning

### Hooks
1. Use command hooks for deterministic rules
2. Use prompt hooks for context-aware decisions
3. Set appropriate timeouts
4. Handle errors gracefully
5. Keep hook logic focused

### Subagents
1. Create focused, specialized subagents
2. Write clear descriptions for delegation
3. Limit tool access appropriately
4. Use built-in subagents when possible
5. Test subagents independently

## Security Considerations

1. **Thinking Mechanism**
   - Validates all inputs
   - Checks safety constraints
   - Assesses risk levels
   - Blocks dangerous operations

2. **Hooks**
   - Execute in sandboxed environment
   - Limited to configured permissions
   - Timeout protection
   - Input validation required

3. **Subagents**
   - Isolated contexts
   - Tool restrictions enforced
   - Permission modes respected
   - All actions logged

## Troubleshooting

### Thinking Mechanism
- Check context configuration
- Review recent observations
- Verify goal alignment
- Examine reasoning output

### Hooks
- Verify hook configuration syntax
- Check command permissions
- Review hook input/output
- Test hooks independently
- Check timeout settings

### Subagents
- Verify subagent exists
- Check tool permissions
- Review subagent logs
- Test with simple tasks
- Verify frontmatter syntax

## Future Enhancements

1. **Thinking Mechanism**
   - Machine learning-based evaluation
   - Pattern recognition
   - Historical learning
   - Multi-agent coordination

2. **Hooks**
   - WebAssembly hook support
   - Conditional hook chaining
   - Hook marketplace
   - Performance optimization

3. **Subagents**
   - Parallel execution
   - Result caching
   - Auto-scaling
   - Cross-project sharing

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) - Overall system architecture
- [USAGE.md](USAGE.md) - Usage guide with examples
- [QUICKREF.md](QUICKREF.md) - Quick reference
- [README.md](README.md) - Project overview

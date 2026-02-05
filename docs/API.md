# AGI-MCP API Documentation

## Overview

AGI-MCP provides 12 MCP tools organized into three categories:
- **GOTCHA Framework Tools** (7 tools) - Cognitive layer operations
- **ATLAS Process Tools** (2 tools) - Task execution methodology  
- **Memory Management Tools** (3 tools) - Data retrieval and session tracking

All tools follow the MCP protocol and return structured responses with success status, data, and messages.

## Table of Contents

- [GOTCHA Framework Tools](#gotcha-framework-tools)
- [ATLAS Process Tools](#atlas-process-tools)
- [Memory Management Tools](#memory-management-tools)
- [Response Format](#response-format)
- [Error Handling](#error-handling)
- [Code Examples](#code-examples)

## GOTCHA Framework Tools

### 1. set_goal

Define a new goal for the AGI system to pursue.

**Input Schema**:
```typescript
{
  goal: string;          // Required: Goal description
  priority?: number;     // Optional: Priority level 1-10 (default: 5)
}
```

**Return Type**:
```typescript
{
  success: boolean;
  goalId: number;        // Database ID of created goal
  message: string;       // Confirmation message
}
```

**Examples**:

```typescript
// Basic goal
{
  "goal": "Implement user authentication system"
}

// Returns:
{
  "success": true,
  "goalId": 42,
  "message": "Goal set successfully: Implement user authentication system"
}

// Goal with priority
{
  "goal": "Fix critical security vulnerability",
  "priority": 10
}

// Returns:
{
  "success": true,
  "goalId": 43,
  "message": "Goal set successfully: Fix critical security vulnerability"
}
```

**Use Cases**:
- Define objectives for work sessions
- Track long-term projects
- Prioritize tasks
- Maintain context across sessions

**Database Storage**:
- Table: `goals`
- Status: `active` (default)
- Queryable via `get_active_goals` and `get_memory`

---

### 2. observe

Record an observation about the environment or current state.

**Input Schema**:
```typescript
{
  observation: string;   // Required: Observation content
  source?: string;       // Optional: Source of observation
}
```

**Return Type**:
```typescript
{
  success: boolean;
  observationId: number; // Database ID
  message: string;
}
```

**Examples**:

```typescript
// Basic observation
{
  "observation": "User reported slow API response times"
}

// Returns:
{
  "success": true,
  "observationId": 128,
  "message": "Observation recorded: User reported slow API response times"
}

// Observation with source
{
  "observation": "Database query taking 2.5 seconds on average",
  "source": "performance-monitor"
}

// Returns:
{
  "success": true,
  "observationId": 129,
  "message": "Observation recorded: Database query taking 2.5 seconds on average"
}
```

**Common Sources**:
- `user` - Direct user input
- `system` - System-generated observations
- `subagent` - From subagent execution
- `monitor` - From monitoring tools
- `test` - From test execution

**Use Cases**:
- Record environmental state
- Capture user requirements
- Log system events
- Track external inputs
- Document discovered facts

---

### 3. think

Record a thought or reasoning process.

**Input Schema**:
```typescript
{
  thought: string;       // Required: Thought content
  reasoning?: string;    // Optional: Reasoning process
}
```

**Return Type**:
```typescript
{
  success: boolean;
  thoughtId: number;     // Database ID
  message: string;
}
```

**Examples**:

```typescript
// Basic thought
{
  "thought": "Need to add caching layer to improve performance"
}

// Returns:
{
  "success": true,
  "thoughtId": 256,
  "message": "Thought recorded: Need to add caching layer to improve performance"
}

// Thought with reasoning
{
  "thought": "Redis would be the best caching solution",
  "reasoning": "Already used in the stack, team has expertise, proven at scale"
}

// Returns:
{
  "success": true,
  "thoughtId": 257,
  "message": "Thought recorded: Redis would be the best caching solution"
}
```

**Use Cases**:
- Document decision-making process
- Record planning steps
- Capture insights and ideas
- Track problem-solving approaches
- Maintain reasoning trail

---

### 4. execute_command

Execute a command and record it in memory.

**Input Schema**:
```typescript
{
  command: string;       // Required: Command description
  parameters?: object;   // Optional: Command parameters
}
```

**Return Type**:
```typescript
{
  success: boolean;
  commandId: number;     // Database ID
  message: string;
}
```

**Examples**:

```typescript
// Simple command
{
  "command": "create_cache_layer"
}

// Returns:
{
  "success": true,
  "commandId": 512,
  "message": "Command executed: create_cache_layer"
}

// Command with parameters
{
  "command": "configure_redis",
  "parameters": {
    "host": "localhost",
    "port": 6379,
    "maxmemory": "256mb",
    "eviction_policy": "allkeys-lru"
  }
}

// Returns:
{
  "success": true,
  "commandId": 513,
  "message": "Command executed: configure_redis"
}
```

**Note**: This tool records command execution in memory but does not actually execute shell commands or system operations. It's for tracking actions within the GOTCHA framework.

**Use Cases**:
- Log action execution
- Track implementation steps
- Record configuration changes
- Document operations performed
- Link commands to goals

---

### 5. form_hypothesis

Form a hypothesis about expected outcomes.

**Input Schema**:
```typescript
{
  hypothesis: string;    // Required: Hypothesis statement
  prediction?: string;   // Optional: Predicted outcome
  confidence?: number;   // Optional: Confidence 0.0-1.0
}
```

**Return Type**:
```typescript
{
  success: boolean;
  hypothesisId: number;  // Database ID
  message: string;
}
```

**Examples**:

```typescript
// Basic hypothesis
{
  "hypothesis": "Adding Redis caching will reduce API response time"
}

// Returns:
{
  "success": true,
  "hypothesisId": 64,
  "message": "Hypothesis formed: Adding Redis caching will reduce API response time"
}

// Full hypothesis with prediction and confidence
{
  "hypothesis": "Caching database queries will improve performance",
  "prediction": "Average response time will drop from 2.5s to under 500ms",
  "confidence": 0.85
}

// Returns:
{
  "success": true,
  "hypothesisId": 65,
  "message": "Hypothesis formed: Caching database queries will improve performance"
}
```

**Confidence Levels**:
- `0.0 - 0.3`: Low confidence, uncertain
- `0.3 - 0.6`: Medium confidence, likely
- `0.6 - 0.9`: High confidence, very likely
- `0.9 - 1.0`: Very high confidence, almost certain

**Use Cases**:
- Predict outcomes before implementation
- Track assumptions
- Validate approaches
- Measure prediction accuracy
- Guide experimentation

---

### 6. assess_performance

Assess performance and record learnings.

**Input Schema**:
```typescript
{
  assessment: string;    // Required: Assessment content
  score?: number;        // Optional: Score 0.0-1.0
  learnings?: string;    // Optional: Key learnings
}
```

**Return Type**:
```typescript
{
  success: boolean;
  assessmentId: number;  // Database ID
  message: string;
}
```

**Examples**:

```typescript
// Basic assessment
{
  "assessment": "Redis caching implementation completed successfully"
}

// Returns:
{
  "success": true,
  "assessmentId": 32,
  "message": "Assessment recorded: Redis caching implementation completed successfully"
}

// Full assessment with score and learnings
{
  "assessment": "Caching reduced API response time as predicted",
  "score": 0.95,
  "learnings": "Average response time dropped to 350ms. Connection pooling was critical for performance. Consider implementing cache warming for frequently accessed data."
}

// Returns:
{
  "success": true,
  "assessmentId": 33,
  "message": "Assessment recorded: Caching reduced API response time as predicted"
}
```

**Performance Score Guidelines**:
- `0.0 - 0.4`: Failed or poor performance
- `0.4 - 0.7`: Acceptable but needs improvement
- `0.7 - 0.9`: Good performance
- `0.9 - 1.0`: Excellent performance

**Use Cases**:
- Evaluate completed work
- Capture lessons learned
- Measure success metrics
- Close GOTCHA cycles
- Build knowledge base

---

### 7. process_goal_with_gotcha

Process a goal through all GOTCHA framework layers automatically.

**Input Schema**:
```typescript
{
  goal: string;          // Required: Goal to process
  priority?: number;     // Optional: Priority 1-10 (default: 5)
}
```

**Return Type**:
```typescript
{
  success: boolean;
  result: {
    goalId: number;
    status: string;      // 'initialized'
    message: string;
  };
  message: string;
}
```

**Examples**:

```typescript
{
  "goal": "Optimize database queries",
  "priority": 8
}

// Returns:
{
  "success": true,
  "result": {
    "goalId": 99,
    "status": "initialized",
    "message": "Goal processing initialized through GOTCHA layers"
  },
  "message": "Goal processed through GOTCHA framework: Optimize database queries"
}
```

**What Happens**:
1. **Goal**: Creates goal in database
2. **Observation**: Records initial observation
3. **Thought**: Logs initial planning thought
4. **Hypothesis**: Forms expected outcome hypothesis

**Use Cases**:
- Quick goal initialization
- Automated GOTCHA cycle setup
- Batch goal processing
- Template-based workflows

---

## ATLAS Process Tools

### 8. execute_atlas_task

Execute a task using the ATLAS 5-step process.

**Input Schema**:
```typescript
{
  task_id: string;       // Required: Unique task identifier
  description: string;   // Required: Task description
  context?: object;      // Optional: Additional context
}
```

**Return Type**:
```typescript
{
  success: boolean;
  result: {
    analyze: object;     // Analysis results
    breakdown: string[]; // Subtasks
    learn: object;       // Knowledge gathered
    act: object[];       // Execution results
    synthesize: object;  // Final synthesis
  };
  message: string;
}
```

**Examples**:

```typescript
// Basic ATLAS task
{
  "task_id": "perf-001",
  "description": "Optimize database performance"
}

// Returns:
{
  "success": true,
  "result": {
    "analyze": {
      "taskId": "perf-001",
      "complexity": "medium",
      "requirements": ["profiling tools", "query analyzer", "index optimizer"],
      "estimatedTime": "6 hours"
    },
    "breakdown": [
      "Profile current query performance",
      "Identify slow queries",
      "Analyze execution plans",
      "Add missing indices",
      "Optimize query structure"
    ],
    "learn": {
      "requiredKnowledge": ["SQL optimization", "indexing strategies"],
      "resources": ["database documentation", "query profiler"],
      "capabilities": ["has_profiler", "can_modify_schema"]
    },
    "act": [
      { "subtask": "Profile queries", "status": "completed", "result": "..." },
      { "subtask": "Add indices", "status": "completed", "result": "..." }
    ],
    "synthesize": {
      "results": "Performance improved by 75%",
      "insights": "Composite indices most effective",
      "performanceScore": 0.92
    }
  },
  "message": "ATLAS task completed: Optimize database performance"
}

// Task with context
{
  "task_id": "auth-impl-001",
  "description": "Implement JWT authentication",
  "context": {
    "framework": "Express.js",
    "database": "PostgreSQL",
    "requirements": ["refresh tokens", "role-based access"]
  }
}
```

**The 5 ATLAS Steps**:

1. **Analyze**: Understand task complexity and requirements
2. **Task Breakdown**: Decompose into manageable subtasks
3. **Learn**: Gather necessary knowledge and resources
4. **Act**: Execute planned actions systematically
5. **Synthesize**: Integrate results and extract insights

**Use Cases**:
- Complex multi-step tasks
- Structured problem-solving
- Project execution
- Feature implementation
- Systematic workflows

**Database Storage**:
- Table: `atlas_steps`
- One row per step per task
- Queryable via `get_atlas_history`

---

### 9. get_atlas_history

Retrieve ATLAS process history for a specific task.

**Input Schema**:
```typescript
{
  task_id: string;       // Required: Task identifier
}
```

**Return Type**:
```typescript
{
  success: boolean;
  taskId: string;
  steps: Array<{
    id: number;
    timestamp: string;
    step: string;        // Step name
    content: string;     // JSON-encoded step data
    status: string;      // 'pending' | 'completed' | 'failed'
  }>;
  count: number;
}
```

**Examples**:

```typescript
{
  "task_id": "perf-001"
}

// Returns:
{
  "success": true,
  "taskId": "perf-001",
  "steps": [
    {
      "id": 1,
      "timestamp": "2024-01-15T10:00:00Z",
      "step": "Analyze",
      "content": "{\"complexity\":\"medium\",\"requirements\":[...]}",
      "status": "completed"
    },
    {
      "id": 2,
      "timestamp": "2024-01-15T10:05:00Z",
      "step": "Task Breakdown",
      "content": "{\"subtasks\":[...]}",
      "status": "completed"
    },
    {
      "id": 3,
      "timestamp": "2024-01-15T10:10:00Z",
      "step": "Learn",
      "content": "{\"requiredKnowledge\":[...]}",
      "status": "completed"
    },
    {
      "id": 4,
      "timestamp": "2024-01-15T10:20:00Z",
      "step": "Act",
      "content": "{\"executedSubtasks\":[...]}",
      "status": "completed"
    },
    {
      "id": 5,
      "timestamp": "2024-01-15T11:00:00Z",
      "step": "Synthesize",
      "content": "{\"results\":\"...\",\"insights\":\"...\"}",
      "status": "completed"
    }
  ],
  "count": 5
}
```

**Use Cases**:
- Review task execution
- Audit task completion
- Analyze process effectiveness
- Debug task failures
- Extract learnings from past tasks

---

## Memory Management Tools

### 10. get_active_goals

Retrieve all active goals from memory.

**Input Schema**:
```typescript
{}  // No parameters required
```

**Return Type**:
```typescript
{
  success: boolean;
  goals: Array<{
    id: number;
    timestamp: string;
    goal: string;
    priority: number;
    status: string;
    metadata: string;
  }>;
  count: number;
}
```

**Examples**:

```typescript
{}

// Returns:
{
  "success": true,
  "goals": [
    {
      "id": 42,
      "timestamp": "2024-01-15T09:00:00Z",
      "goal": "Implement user authentication",
      "priority": 9,
      "status": "active",
      "metadata": "{\"category\":\"feature\"}"
    },
    {
      "id": 43,
      "timestamp": "2024-01-15T10:00:00Z",
      "goal": "Optimize database queries",
      "priority": 8,
      "status": "active",
      "metadata": "{\"category\":\"performance\"}"
    }
  ],
  "count": 2
}
```

**Use Cases**:
- Review current objectives
- Prioritize work
- Track progress
- Context awareness
- Session planning

---

### 11. get_memory

Retrieve memory entries by layer.

**Input Schema**:
```typescript
{
  layer: string;         // Required: Memory layer name
  limit?: number;        // Optional: Max entries (default: 100)
}
```

**Valid Layers**:
- `goals`
- `observations`
- `thoughts`
- `commands`
- `hypotheses`
- `assessments`

**Return Type**:
```typescript
{
  success: boolean;
  layer: string;
  entries: Array<object>;  // Layer-specific structure
  count: number;
}
```

**Examples**:

```typescript
// Get recent thoughts
{
  "layer": "thoughts",
  "limit": 5
}

// Returns:
{
  "success": true,
  "layer": "thoughts",
  "entries": [
    {
      "id": 256,
      "timestamp": "2024-01-15T10:30:00Z",
      "thought": "Need to add caching layer",
      "reasoning": "Performance bottleneck identified",
      "metadata": null
    },
    {
      "id": 257,
      "timestamp": "2024-01-15T10:35:00Z",
      "thought": "Redis would be best caching solution",
      "reasoning": "Team expertise, proven scalability",
      "metadata": null
    }
  ],
  "count": 2
}

// Get observations
{
  "layer": "observations",
  "limit": 10
}

// Returns:
{
  "success": true,
  "layer": "observations",
  "entries": [
    {
      "id": 128,
      "timestamp": "2024-01-15T09:15:00Z",
      "observation": "API response times averaging 2.5 seconds",
      "source": "monitor",
      "metadata": "{\"endpoint\":\"/api/users\"}"
    }
  ],
  "count": 1
}

// Get hypotheses
{
  "layer": "hypotheses",
  "limit": 3
}

// Returns:
{
  "success": true,
  "layer": "hypotheses",
  "entries": [
    {
      "id": 64,
      "timestamp": "2024-01-15T10:40:00Z",
      "hypothesis": "Caching will reduce response time",
      "prediction": "Response time will drop to under 500ms",
      "confidence": 0.85,
      "validated": 0,
      "metadata": null
    }
  ],
  "count": 1
}
```

**Use Cases**:
- Review specific memory layers
- Analyze decision history
- Track observations over time
- Validate hypotheses
- Extract learnings

---

### 12. get_session_summary

Get a summary of the current session.

**Input Schema**:
```typescript
{}  // No parameters required
```

**Return Type**:
```typescript
{
  success: boolean;
  summary: {
    totalMemoryEntries: number;
    activeGoals: number;
    memoryByLayer: {
      total: number;
    };
    timestamp: string;
  };
}
```

**Examples**:

```typescript
{}

// Returns:
{
  "success": true,
  "summary": {
    "totalMemoryEntries": 342,
    "activeGoals": 3,
    "memoryByLayer": {
      "total": 342
    },
    "timestamp": "2024-01-15T12:00:00Z"
  }
}
```

**Use Cases**:
- Session overview
- Progress tracking
- Activity summary
- Context review
- Session closing

---

## Response Format

### Success Response

All tools return a consistent success response:

```typescript
{
  success: true,
  // Tool-specific data fields
  ...data,
  message?: string;  // Optional confirmation message
}
```

### Error Response

Errors are thrown and handled by the MCP framework:

```typescript
{
  error: {
    code: string;      // Error code
    message: string;   // Error description
    details?: any;     // Additional error details
  }
}
```

### Common HTTP-style Error Codes

- `INVALID_PARAMS`: Invalid or missing required parameters
- `NOT_FOUND`: Requested resource not found
- `INTERNAL_ERROR`: Internal server error
- `DATABASE_ERROR`: Database operation failed

---

## Error Handling

### Validation Errors

```typescript
// Missing required field
{
  "goal": ""  // Empty string
}

// Error:
{
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Goal cannot be empty"
  }
}

// Invalid priority range
{
  "goal": "Test goal",
  "priority": 15  // Must be 1-10
}

// Error:
{
  "error": {
    "code": "INVALID_PARAMS",
    "message": "Priority must be between 1 and 10"
  }
}
```

### Database Errors

```typescript
// Database unavailable
{
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Failed to connect to database",
    "details": "SQLITE_CANTOPEN: unable to open database file"
  }
}
```

### Not Found Errors

```typescript
// Non-existent task
{
  "task_id": "non-existent-task"
}

// Returns (no error, just empty):
{
  "success": true,
  "taskId": "non-existent-task",
  "steps": [],
  "count": 0
}
```

---

## Code Examples

### Complete GOTCHA Workflow

```typescript
// 1. Set a goal
const goalResult = await callTool('set_goal', {
  goal: 'Implement rate limiting',
  priority: 8
});
const goalId = goalResult.goalId;

// 2. Make observations
await callTool('observe', {
  observation: 'API currently has no rate limiting',
  source: 'security-audit'
});

await callTool('observe', {
  observation: 'Experiencing DoS-style traffic spikes',
  source: 'monitor'
});

// 3. Think through the approach
await callTool('think', {
  thought: 'Will use express-rate-limit middleware',
  reasoning: 'Widely used, actively maintained, easy integration'
});

// 4. Form hypothesis
await callTool('form_hypothesis', {
  hypothesis: 'Rate limiting will prevent DoS attacks',
  prediction: 'Server load will stabilize during traffic spikes',
  confidence: 0.9
});

// 5. Execute commands
await callTool('execute_command', {
  command: 'install_rate_limit_middleware',
  parameters: { package: 'express-rate-limit', version: '^6.0.0' }
});

await callTool('execute_command', {
  command: 'configure_rate_limits',
  parameters: { windowMs: 60000, max: 100 }
});

// 6. Assess performance
await callTool('assess_performance', {
  assessment: 'Rate limiting successfully implemented and tested',
  score: 0.95,
  learnings: 'Works as expected. Consider per-user limits for better UX. Monitor for false positives.'
});

// 7. Review session
const summary = await callTool('get_session_summary', {});
console.log(summary);
```

### Using ATLAS Process

```typescript
// Execute a complex task with ATLAS
const result = await callTool('execute_atlas_task', {
  task_id: 'feature-search-001',
  description: 'Implement full-text search functionality',
  context: {
    database: 'PostgreSQL',
    requirements: ['fuzzy matching', 'ranking', 'highlighting']
  }
});

// ATLAS automatically:
// 1. Analyzes complexity and requirements
// 2. Breaks down into subtasks
// 3. Identifies knowledge needs
// 4. Executes subtasks
// 5. Synthesizes results

// Review the execution
const history = await callTool('get_atlas_history', {
  task_id: 'feature-search-001'
});

console.log('Steps executed:', history.steps);
```

### Querying Memory

```typescript
// Get all active goals
const goals = await callTool('get_active_goals', {});
console.log(`${goals.count} active goals`);

// Review recent thoughts
const thoughts = await callTool('get_memory', {
  layer: 'thoughts',
  limit: 10
});

// Check hypothesis validation
const hypotheses = await callTool('get_memory', {
  layer: 'hypotheses',
  limit: 20
});

// Review assessments for learnings
const assessments = await callTool('get_memory', {
  layer: 'assessments',
  limit: 5
});

assessments.entries.forEach(a => {
  if (a.learnings) {
    console.log('Learning:', a.learnings);
  }
});
```

### Error Handling Pattern

```typescript
async function safeToolCall(toolName: string, args: any) {
  try {
    const result = await callTool(toolName, args);
    
    if (result.success) {
      return result;
    } else {
      console.error(`Tool failed: ${toolName}`, result);
      return null;
    }
  } catch (error) {
    console.error(`Error calling ${toolName}:`, error);
    
    // Log the error
    await callTool('observe', {
      observation: `Tool call failed: ${toolName}`,
      source: 'error-handler'
    });
    
    return null;
  }
}

// Usage
const result = await safeToolCall('set_goal', {
  goal: 'My goal',
  priority: 8
});

if (result) {
  console.log('Goal created:', result.goalId);
}
```

---

## Tool Categories Summary

### Quick Reference Table

| Tool | Category | Input | Returns | Use For |
|------|----------|-------|---------|---------|
| `set_goal` | GOTCHA-G | goal, priority | goalId | Define objectives |
| `observe` | GOTCHA-O | observation, source | observationId | Record state |
| `think` | GOTCHA-T | thought, reasoning | thoughtId | Document reasoning |
| `execute_command` | GOTCHA-C | command, parameters | commandId | Track actions |
| `form_hypothesis` | GOTCHA-H | hypothesis, prediction, confidence | hypothesisId | Predict outcomes |
| `assess_performance` | GOTCHA-A | assessment, score, learnings | assessmentId | Evaluate results |
| `process_goal_with_gotcha` | GOTCHA | goal, priority | result | Auto-initialize |
| `execute_atlas_task` | ATLAS | task_id, description, context | 5-step result | Complex tasks |
| `get_atlas_history` | ATLAS | task_id | steps[] | Review execution |
| `get_active_goals` | Memory | - | goals[] | List objectives |
| `get_memory` | Memory | layer, limit | entries[] | Query layer |
| `get_session_summary` | Memory | - | summary | Session overview |

---

## Related Documentation

- [Getting Started](GETTING_STARTED.md) - Installation and setup
- [Memory System](MEMORY_SYSTEM.md) - Database schema and queries
- [Agents Documentation](AGENTS.md) - Subagent tools
- [Usage Guide](../USAGE.md) - Comprehensive examples

---

**AGI-MCP API** - 12 MCP tools for AGI-like cognitive operations with the GOTCHA Framework and ATLAS Process.

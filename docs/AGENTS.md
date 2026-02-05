# AGI-MCP Subagent System Documentation

## Overview

The AGI-MCP subagent system provides specialized AI assistants for focused tasks. Each subagent operates in an isolated context with its own memory, tools, and permissions, allowing for efficient delegation of specific workloads.

## Table of Contents

- [Built-in Subagents](#built-in-subagents)
- [Subagent Configuration](#subagent-configuration)
- [Using Subagents](#using-subagents)
- [Creating Custom Subagents](#creating-custom-subagents)
- [Subagent Lifecycle](#subagent-lifecycle)
- [Best Practices](#best-practices)

## Built-in Subagents

AGI-MCP includes four specialized built-in subagents, each optimized for specific use cases:

### 1. Explore Subagent

**Purpose**: Fast, read-only codebase analysis and exploration

**Use Cases**:
- Finding files and patterns
- Searching code without modifications
- Understanding codebase structure
- Answering questions about code
- Quick information retrieval

**Configuration**:
```json
{
  "name": "explore",
  "model": "haiku",
  "tools": ["get_memory", "get_active_goals", "get_atlas_history"],
  "disallowedTools": ["execute_command", "set_goal", "execute_atlas_task"],
  "permissionMode": "default"
}
```

**Example Usage**:
```typescript
// Find all authentication-related files
await tools.handleToolCall('execute_subagent', {
  subagent: 'explore',
  task: 'Find all files related to user authentication'
});

// Analyze code patterns
await tools.handleToolCall('execute_subagent', {
  subagent: 'explore',
  task: 'What patterns are used for error handling in this codebase?'
});
```

**Characteristics**:
- ⚡ Fast response time (uses Haiku model)
- 🔒 Read-only access
- 🔍 Optimized for search and analysis
- 💾 Can access memory and goals

### 2. General-Purpose Subagent

**Purpose**: Complex, multi-step tasks requiring both exploration and action

**Use Cases**:
- Research and synthesis
- Multi-step operations
- Code modifications and implementations
- Complex reasoning tasks
- Mixed read/write workflows

**Configuration**:
```json
{
  "name": "general-purpose",
  "model": "inherit",
  "tools": ["all"],
  "permissionMode": "default"
}
```

**Example Usage**:
```typescript
// Implement a new feature
await tools.handleToolCall('execute_subagent', {
  subagent: 'general-purpose',
  task: 'Implement user authentication with JWT tokens'
});

// Research and document
await tools.handleToolCall('execute_subagent', {
  subagent: 'general-purpose',
  task: 'Research best practices for API rate limiting and create implementation plan'
});
```

**Characteristics**:
- 🧠 Full reasoning capability (inherits parent model)
- 🔓 Access to all tools
- 📝 Can read and write
- 🎯 Best for complex workflows

### 3. Task Executor Subagent

**Purpose**: Command execution, testing, and automation

**Use Cases**:
- Running tests and builds
- Executing shell commands
- Automated task execution
- Performance testing
- Deployment automation

**Configuration**:
```json
{
  "name": "task-executor",
  "model": "haiku",
  "tools": ["execute_command", "get_memory", "assess_performance"],
  "permissionMode": "default"
}
```

**Example Usage**:
```typescript
// Run test suite
await tools.handleToolCall('execute_subagent', {
  subagent: 'task-executor',
  task: 'Run all unit tests and report results'
});

// Build and deploy
await tools.handleToolCall('execute_subagent', {
  subagent: 'task-executor',
  task: 'Build the project and run deployment checks'
});
```

**Characteristics**:
- ⚡ Fast execution (uses Haiku model)
- 🔧 Command-line focused
- 📊 Provides concise summaries
- ⚠️ Reports failures with diagnostic details

### 4. Code Reviewer Subagent

**Purpose**: Expert code quality and security review

**Use Cases**:
- Post-implementation code review
- Security vulnerability detection
- Code quality assessment
- Best practices validation
- Performance analysis

**Configuration**:
```json
{
  "name": "code-reviewer",
  "model": "inherit",
  "tools": ["get_memory", "think", "form_hypothesis", "assess_performance"],
  "disallowedTools": ["execute_command", "set_goal"],
  "permissionMode": "default"
}
```

**Example Usage**:
```typescript
// Review recent changes
await tools.handleToolCall('execute_subagent', {
  subagent: 'code-reviewer',
  task: 'Review the authentication module for security issues'
});

// Pre-deployment review
await tools.handleToolCall('execute_subagent', {
  subagent: 'code-reviewer',
  task: 'Review all changes in the current branch before merging'
});
```

**Review Checklist**:
- ✅ Code clarity and readability
- ✅ Proper naming conventions
- ✅ No code duplication
- ✅ Error handling implemented
- ✅ No exposed secrets/credentials
- ✅ Input validation present
- ✅ Test coverage adequate
- ✅ Performance considerations

**Characteristics**:
- 🔍 Deep analysis (inherits parent model)
- 🚫 Cannot modify code
- 🛡️ Security-focused
- 📋 Prioritized feedback (Critical/Warning/Suggestion)

## Subagent Configuration

### Configuration Schema

```typescript
interface SubagentConfig {
  name: string;                    // Unique subagent identifier
  description: string;             // Human-readable description
  systemPrompt: string;            // System prompt defining behavior
  tools?: string[];                // Allowed tools (optional)
  disallowedTools?: string[];      // Explicitly disallowed tools
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
  permissionMode?: 'default' | 'acceptEdits' | 'dontAsk' | 'bypassPermissions' | 'plan';
  skills?: string[];               // Special capabilities
  hooks?: HookConfig;              // Custom hooks
  color?: string;                  // Terminal color for output
}
```

### Permission Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| `default` | Standard permission checks | Most subagents |
| `acceptEdits` | Auto-accept edit operations | Trusted code modifications |
| `dontAsk` | Skip permission prompts | Automated workflows |
| `bypassPermissions` | Full access without checks | Admin operations |
| `plan` | Planning mode only | Analysis tasks |

### Model Selection

| Model | Speed | Capability | Cost | Best For |
|-------|-------|------------|------|----------|
| `haiku` | ⚡⚡⚡ | ⭐⭐ | $ | Quick tasks, commands |
| `sonnet` | ⚡⚡ | ⭐⭐⭐⭐ | $$ | Complex reasoning |
| `opus` | ⚡ | ⭐⭐⭐⭐⭐ | $$$ | Advanced analysis |
| `inherit` | Varies | Varies | Varies | Use parent's model |

## Using Subagents

### Execute Subagent

Delegate a task to a subagent:

```typescript
await tools.handleToolCall('execute_subagent', {
  subagent: 'explore',           // Subagent name
  task: 'Find authentication code',  // Task description
  context?: {}                   // Optional context
});
```

### Resume Subagent

Continue previous subagent work:

```typescript
await tools.handleToolCall('resume_subagent', {
  subagent_id: 'explore-abc123',  // Instance ID
  additional_context?: 'Check utils/ too'
});
```

### List Available Subagents

```typescript
const result = await tools.handleToolCall('list_subagents', {});
// Returns: Array of subagent configurations
```

### Subagent Workflow Example

```typescript
// 1. Use explore to understand the codebase
const exploreResult = await tools.handleToolCall('execute_subagent', {
  subagent: 'explore',
  task: 'Identify all API endpoints and their authentication methods'
});

// 2. Use general-purpose to implement changes
const implementResult = await tools.handleToolCall('execute_subagent', {
  subagent: 'general-purpose',
  task: 'Add rate limiting to all public API endpoints'
});

// 3. Use task-executor to test
const testResult = await tools.handleToolCall('execute_subagent', {
  subagent: 'task-executor',
  task: 'Run integration tests for API endpoints'
});

// 4. Use code-reviewer for final review
const reviewResult = await tools.handleToolCall('execute_subagent', {
  subagent: 'code-reviewer',
  task: 'Review rate limiting implementation for security and performance'
});
```

## Creating Custom Subagents

### Directory Structure

Custom subagents can be created at two levels:

```
# User-level (global)
~/.agi-mcp/subagents/
  ├── my-specialist.md
  └── data-analyst.md

# Project-level (repository)
.agi-mcp/subagents/
  ├── api-tester.md
  └── doc-writer.md
```

### Subagent Definition Format

Create a Markdown file with YAML frontmatter:

```markdown
---
name: api-tester
description: API testing specialist for REST endpoints
model: haiku
permissionMode: default
tools: execute_command, assess_performance
color: cyan
---

You are the API Testing Specialist subagent.

Your purpose:
- Test REST API endpoints thoroughly
- Validate request/response formats
- Check authentication and authorization
- Test error handling and edge cases
- Generate test reports

Testing approach:
1. Identify all endpoints from documentation
2. Test happy path scenarios
3. Test error cases (401, 403, 404, 500)
4. Validate response schemas
5. Check performance and response times

Provide clear, actionable test results with:
- Total tests run
- Pass/fail counts
- Specific failures with details
- Performance metrics
```

### Advanced Custom Subagent Example

```markdown
---
name: security-auditor
description: Security vulnerability scanner and advisor
model: sonnet
permissionMode: default
disallowedTools: execute_command
skills: security, vulnerability-scanning, compliance
color: red
---

You are a Security Auditor subagent specializing in application security.

## Your Expertise
- OWASP Top 10 vulnerabilities
- Secure coding practices
- Authentication and authorization flaws
- Data protection and encryption
- API security

## Audit Process
1. **Reconnaissance**
   - Identify attack surface
   - Map data flows
   - Locate sensitive operations

2. **Vulnerability Assessment**
   - SQL injection risks
   - XSS vulnerabilities
   - CSRF protections
   - Insecure dependencies
   - Exposed secrets

3. **Risk Prioritization**
   - Critical: Immediate fix required
   - High: Fix before deployment
   - Medium: Address in next sprint
   - Low: Consider for future improvement

4. **Remediation Guidance**
   - Specific fix recommendations
   - Code examples
   - Security best practices

## Output Format
Provide structured findings:
- Severity level
- Affected component
- Vulnerability description
- Exploitation scenario
- Remediation steps
- References (CVE, CWE, OWASP)
```

### Testing Custom Subagents

```bash
# 1. Create the subagent file
mkdir -p ~/.agi-mcp/subagents
cat > ~/.agi-mcp/subagents/my-agent.md << 'EOF'
---
name: my-agent
description: My custom specialist
model: haiku
---
Your system prompt here...
EOF

# 2. Restart AGI-MCP server
npm start

# 3. List subagents to verify
# Use list_subagents tool

# 4. Test your subagent
# Use execute_subagent with your custom agent
```

## Subagent Lifecycle

### Lifecycle Stages

```
1. Registration
   ↓
2. Initialization (on first use)
   ↓
3. Execution (task processing)
   ↓
4. Completion (result return)
   ↓
5. Persistence (optional resume)
```

### Instance Management

Each subagent execution creates an instance:

```typescript
interface SubagentInstance {
  id: string;                    // Unique instance ID
  config: SubagentConfig;        // Subagent configuration
  db: MemoryDatabase;            // Isolated memory
  gotcha: GOTCHAFramework;       // GOTCHA framework
  atlas: ATLASProcess;           // ATLAS process
  context: string[];             // Execution context
  status: 'active' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  parentSessionId?: string;      // Parent session reference
}
```

### Memory Isolation

Each subagent instance has isolated memory:
- Separate GOTCHA layer entries
- Independent ATLAS task tracking
- Own session context
- No cross-contamination with parent or siblings

### Resumable Sessions

```typescript
// Start subagent and get instance ID
const result = await executeSubagent('explore', 'Find auth code');
const instanceId = result.instance_id;

// Later, resume with additional context
await resumeSubagent(instanceId, 'Also check the middleware/');
```

## Best Practices

### When to Use Subagents

✅ **DO use subagents when**:
- Task is well-defined and focused
- Specialized skills are needed
- Isolation is beneficial
- Parallel work is possible
- Different model characteristics are optimal

❌ **DON'T use subagents when**:
- Task requires parent context
- Frequent back-and-forth needed
- Simple one-off operations
- Overhead exceeds benefits

### Subagent Selection Guide

| Task Type | Recommended Subagent | Reason |
|-----------|---------------------|---------|
| Code search | `explore` | Fast, read-only, optimized for search |
| Testing | `task-executor` | Command-focused, concise results |
| Implementation | `general-purpose` | Full capabilities, complex reasoning |
| Code review | `code-reviewer` | Security-focused, quality standards |
| Documentation | Custom `doc-writer` | Specialized prompts and skills |
| API testing | Custom `api-tester` | Domain-specific knowledge |

### Performance Optimization

1. **Use appropriate models**:
   - `haiku` for simple, fast tasks
   - `sonnet` for complex reasoning
   - `inherit` when parent model is already optimal

2. **Limit tool access**:
   - Grant only necessary tools
   - Use `disallowedTools` to prevent misuse
   - Reduces decision overhead

3. **Provide clear tasks**:
   - Specific, actionable descriptions
   - Include relevant context
   - Define success criteria

4. **Reuse instances when possible**:
   - Use `resume_subagent` for related work
   - Avoids re-initialization overhead
   - Maintains context

### Security Considerations

1. **Permission modes**:
   - Use `default` for most cases
   - Only use `bypassPermissions` when absolutely necessary
   - Document why elevated permissions are needed

2. **Tool restrictions**:
   - Review `disallowedTools` for read-only agents
   - Prevent command execution in analysis agents
   - Use `tools` whitelist for maximum security

3. **Credential handling**:
   - Never include credentials in subagent prompts
   - Use environment variables or secure vaults
   - Audit subagent access logs

### Debugging Subagents

```typescript
// 1. Check subagent registration
await listSubagents();

// 2. Review subagent configuration
const config = subagentSystem.getSubagentConfig('my-agent');
console.log(config);

// 3. Monitor execution
// Check logs in memory/logs/session-*.log

// 4. Inspect database entries
const memory = await getMemory('thoughts');
// Review subagent's reasoning

// 5. Check instance status
const instance = subagentSystem.getInstance(instanceId);
console.log(instance.status, instance.context);
```

## Advanced Topics

### Custom Hook Integration

Subagents can have custom hooks:

```markdown
---
name: validated-executor
description: Command executor with validation hooks
hooks:
  PreToolUse:
    - matcher: execute_command
      type: command
      command: ./validate-safe.sh
---
```

### Multi-Subagent Coordination

```typescript
// Parallel execution
const [exploreResult, testResult] = await Promise.all([
  executeSubagent('explore', 'Analyze codebase'),
  executeSubagent('task-executor', 'Run tests')
]);

// Sequential with context passing
const analysis = await executeSubagent('explore', 'Find issues');
const fixes = await executeSubagent('general-purpose', 
  `Fix issues: ${analysis.content}`);
const review = await executeSubagent('code-reviewer', 
  `Review fixes for: ${analysis.content}`);
```

### Subagent Skills System

Define special capabilities:

```yaml
skills:
  - python
  - docker
  - kubernetes
  - security-scanning
```

Skills can be used for:
- Capability matching
- Tool recommendations
- Automatic subagent selection
- Documentation generation

## Troubleshooting

### Common Issues

**Issue**: Subagent not found
```
Solution: Check name spelling, verify .md file exists, restart server
```

**Issue**: Tool access denied
```
Solution: Review tools/disallowedTools config, check permission mode
```

**Issue**: Poor performance
```
Solution: Consider using faster model (haiku), reduce tool count
```

**Issue**: Context lost between executions
```
Solution: Use resume_subagent instead of new execute_subagent
```

## API Reference

### Execute Subagent Tool

```typescript
{
  name: 'execute_subagent',
  inputSchema: {
    subagent: string;        // Subagent name
    task: string;            // Task description
    context?: any;           // Optional additional context
  },
  returns: {
    instance_id: string;     // For resuming
    result: any;             // Task result
    status: string;          // 'completed' | 'failed'
  }
}
```

### Resume Subagent Tool

```typescript
{
  name: 'resume_subagent',
  inputSchema: {
    subagent_id: string;           // Instance ID
    additional_context?: string;   // Extra context
  },
  returns: {
    result: any;
    status: string;
  }
}
```

### List Subagents Tool

```typescript
{
  name: 'list_subagents',
  inputSchema: {},
  returns: {
    subagents: SubagentConfig[];  // All registered subagents
  }
}
```

## Examples

See [USAGE.md](../USAGE.md) for comprehensive workflow examples and [examples/](../examples/) directory for sample subagent definitions.

## Related Documentation

- [API Documentation](API.md) - Full MCP tool reference
- [Memory System](MEMORY_SYSTEM.md) - Database and storage details
- [Getting Started](GETTING_STARTED.md) - Initial setup guide
- [Advanced Features](../ADVANCED.md) - Hooks and thinking mechanism

---

**AGI-MCP Subagent System** - Specialized AI assistants for focused, efficient task execution

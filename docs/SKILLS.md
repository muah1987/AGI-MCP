# AGI-MCP Skills & Subagent System

## Overview

The AGI-MCP Skill System provides intelligent task orchestration and automatic routing to specialized subagents based on problem type, priority, and human interaction requirements.

## Skill System

Skills coordinate multiple subagents and provide reusable workflows for complex tasks.

### Built-in Skills

#### 1. problem-solver
**Purpose**: Analyzes problems and routes them to the most appropriate specialized agent

**Trigger-based Routing**:
- `error OR bug OR failure OR crash` → debug-engineer (Priority 9, automated)
- `architecture OR design OR system` → architect (Priority 7, requires human)
- `document OR documentation OR guide` → document-writer (Priority 5, automated)
- `network OR connectivity OR infrastructure` → network-engineer (Priority 8, requires human)
- `feature OR implement OR develop` → product-developer (Priority 6, automated)
- `ui OR ux OR interface OR design` → ui-ux-specialist (Priority 7, requires human)

**Usage**:
```json
{
  "tool": "execute_skill",
  "arguments": {
    "skill_name": "problem-solver",
    "context": {
      "description": "Fix authentication bug in login system",
      "priority": 9
    }
  }
}
```

#### 2. atlas-orchestrator
**Purpose**: Coordinates complex tasks through the ATLAS 5-step process

**Capabilities**:
- Breaks down complex tasks into ATLAS steps
- Coordinates execution across multiple subagents
- Ensures systematic progress through all phases
- Tracks and synthesizes results

**Usage**: For multi-step, complex workflows requiring systematic execution

#### 3. gotcha-coordinator
**Purpose**: Manages goal-oriented task execution through GOTCHA framework

**Capabilities**:
- Coordinates goal setting and tracking
- Manages observations and thought processes
- Orchestrates command execution
- Tracks hypotheses and assessments

**Usage**: For goal-driven workflows requiring structured cognitive processing

#### 4. code-quality
**Purpose**: Ensures code meets quality standards and best practices

**Checks**:
- Code readability and maintainability
- Security vulnerabilities
- Performance considerations
- Test coverage
- Documentation completeness

**Usage**: For automated code review and quality assurance

#### 5. plan-with-team ✨ NEW
**Purpose**: Creates detailed engineering implementation plans with team orchestration

**Features**:
- Analyzes user requirements and creates structured plans
- Assigns tasks to specialized team members based on expertise
- Defines clear, measurable acceptance criteria
- Establishes comprehensive team orchestration strategy
- Validates plan structure with automated hooks
- Saves plans to `specs/` directory

**Plan Document Structure**:
- **Task Description**: Concise summary of what needs to be accomplished
- **Objective**: Primary goal and success criteria
- **Relevant Files**: Lists files to create, modify, or reference
- **Step by Step Tasks**: Detailed breakdown with agent assignments and dependencies
- **Acceptance Criteria**: Measurable completion criteria
- **Team Orchestration**: Team members, execution strategy, coordination notes

**Usage**:
```json
{
  "tool": "execute_skill",
  "arguments": {
    "skill_name": "plan-with-team",
    "context": {
      "user_prompt": "Implement user authentication system with JWT tokens",
      "orchestration_prompt": "Use security-focused approach with phased rollout"
    }
  }
}
```

**Output**: Creates `specs/<descriptive-name>.md` with complete implementation blueprint.

**Validation**: Automatically validates that the plan contains all required sections using hooks.

**Example Output**:
```markdown
# Implementation Plan: User Authentication System

## Task Description
Implement secure user authentication with JWT tokens...

## Objective
Create production-ready auth system that...

## Relevant Files
- **Create**: `src/auth/auth-service.ts` - Core authentication logic
- **Modify**: `src/app.ts` - Register auth routes
...

## Step by Step Tasks
1. **Design Database Schema** (Assigned to: architect)
   - Design users and sessions tables
   - Dependencies: None

2. **Implement Password Hashing** (Assigned to: security-engineer)
   - Create bcrypt password service
   - Dependencies: Task 1
...

## Acceptance Criteria
- [ ] Users can register and login
- [ ] JWT tokens validated correctly
- [ ] All tests pass
...

## Team Orchestration

### Team Members
- **architect** - Database design specialist
- **security-engineer** - Security and cryptography expert
- **backend-developer** - TypeScript/Express specialist
...

### Execution Strategy
**Phase 1: Foundation** (Sequential)
1. Architect designs schema
2. Security-engineer implements hashing
...
```

**Hooks**: Validates plan files using:
- `validate_new_file.py` - Ensures plan file created in specs/
- `validate_file_contains.py` - Verifies all required sections present

**Team Member Discovery**: Reads from `.claude/agents/team/*.md` to understand available specialists.

## MCP Tools

**Capabilities**:
- Guides goal-oriented task execution
- Ensures all GOTCHA layers are utilized
- Forms and validates hypotheses
- Learns from assessments

**Usage**: For goal-driven tasks requiring cognitive coherence

#### 4. code-quality
**Purpose**: Ensures code quality, security, and best practices

**Execution**: Runs in forked context (code-reviewer subagent)

**Focus Areas**:
- Code readability and maintainability
- Security vulnerabilities
- Performance optimization
- Error handling and edge cases
- Test coverage and quality

## Specialized Subagents

### 1. debug-engineer
**Specialization**: Debugging, troubleshooting, error resolution  
**Priority**: 9  
**Human Interaction**: Not required  
**Model**: Sonnet

**Capabilities**:
- Root cause analysis
- Error message interpretation
- Stack trace debugging
- Hypothesis formation and testing
- Minimal fix implementation

### 2. architect
**Specialization**: System design, architecture planning  
**Priority**: 7  
**Human Interaction**: Required  
**Model**: Sonnet

**Capabilities**:
- System architecture and design patterns
- Scalability and performance optimization
- Technology stack selection
- Integration patterns and APIs
- Security architecture

### 3. document-writer
**Specialization**: Technical documentation and guides  
**Priority**: 5  
**Human Interaction**: Not required  
**Model**: Sonnet

**Capabilities**:
- Clear, concise technical writing
- Comprehensive documentation
- User guides and tutorials
- API documentation
- Architecture documentation

### 4. network-engineer
**Specialization**: Network configuration, infrastructure, deployment  
**Priority**: 8  
**Human Interaction**: Required  
**Model**: Sonnet

**Capabilities**:
- Network configuration and troubleshooting
- Infrastructure setup and management
- Deployment strategies
- Load balancing and scaling
- Security and firewalls

### 5. product-developer
**Specialization**: Feature development and implementation  
**Priority**: 6  
**Human Interaction**: Not required  
**Model**: Sonnet

**Capabilities**:
- Feature design and implementation
- User requirements analysis
- Code quality and testing
- Integration with existing systems
- Performance optimization

### 6. ui-ux-specialist
**Specialization**: User interface design, user experience, accessibility  
**Priority**: 7  
**Human Interaction**: Required  
**Model**: Sonnet

**Capabilities**:
- User interface design
- User experience optimization
- Accessibility standards (WCAG)
- Responsive design
- Usability testing

### 7. code-reviewer
**Specialization**: Code quality, security, best practices review  
**Priority**: N/A (manual invocation)  
**Human Interaction**: Not required  
**Model**: Inherit from parent

**Capabilities**:
- Code quality review
- Security vulnerability detection
- Best practices enforcement
- Performance analysis
- Documentation completeness checks

### 8-10. Core Subagents
- **explore** - Fast, read-only codebase analysis (Haiku)
- **general-purpose** - Complex multi-step tasks (Inherit)
- **task-executor** - Command execution, testing, automation (Haiku)

## Trigger System

### How Triggers Work

1. **Task Analysis**: Incoming task description is analyzed
2. **Pattern Matching**: Keywords matched against trigger conditions
3. **Priority Sorting**: Matched triggers sorted by priority (highest first)
4. **Human Check**: Best trigger checked for human interaction requirement
5. **Routing**: Task routed to target agent or human approval requested

### Trigger Configuration

```typescript
interface TriggerConfig {
  condition: string;           // Keyword pattern (supports OR/AND)
  priority: number;            // 1-10, higher = more important
  requiresHumanInteraction?: boolean;  // Should human approve?
  targetAgent?: string;        // Which agent to route to
  action: string;              // What action to take
}
```

### Priority Levels

- **9-10**: Critical (errors, crashes, security)
- **7-8**: High (architecture, infrastructure, design)
- **5-6**: Medium (features, documentation)
- **1-4**: Low (minor tasks, optimizations)

### Human Interaction Rules

Tasks requiring human interaction:
- Architecture and design decisions (Priority 7)
- Network and infrastructure changes (Priority 8)
- UI/UX design decisions (Priority 7)

Tasks automated:
- Debugging and error resolution (Priority 9)
- Feature development (Priority 6)
- Documentation (Priority 5)

## MCP Tools

### execute_skill
Execute a skill to orchestrate subagents

```json
{
  "tool": "execute_skill",
  "arguments": {
    "skill_name": "problem-solver",
    "context": {
      "description": "Task description",
      "priority": 7
    }
  }
}
```

### list_skills
List all available skills with descriptions

```json
{
  "tool": "list_skills",
  "arguments": {}
}
```

### execute_subagent
Directly execute a specific subagent

```json
{
  "tool": "execute_subagent",
  "arguments": {
    "subagent_name": "debug-engineer",
    "task": "Investigate authentication failure in login.ts"
  }
}
```

### list_subagents
List all available subagents

```json
{
  "tool": "list_subagents",
  "arguments": {}
}
```

## Usage Examples

### Example 1: Automatic Bug Fixing
```json
{
  "tool": "execute_skill",
  "arguments": {
    "skill_name": "problem-solver",
    "context": {
      "description": "Application crashes when user submits empty form",
      "priority": 9
    }
  }
}
```

**Result**: Automatically routes to debug-engineer (no human interaction needed)

### Example 2: Architecture Decision
```json
{
  "tool": "execute_skill",
  "arguments": {
    "skill_name": "problem-solver",
    "context": {
      "description": "Design microservices architecture for new payment system",
      "priority": 8
    }
  }
}
```

**Result**: Routes to architect with human interaction required

### Example 3: Documentation Task
```json
{
  "tool": "execute_skill",
  "arguments": {
    "skill_name": "problem-solver",
    "context": {
      "description": "Create API documentation for user service",
      "priority": 5
    }
  }
}
```

**Result**: Automatically routes to document-writer

### Example 4: Direct Subagent Execution
```json
{
  "tool": "execute_subagent",
  "arguments": {
    "subagent_name": "code-reviewer",
    "task": "Review security in authentication module"
  }
}
```

**Result**: Runs code-reviewer directly without skill orchestration

## Custom Skills

Create custom skills by placing Markdown files in:
- **User-level**: `~/.agi-mcp/skills/`
- **Project-level**: `.agi-mcp/skills/`

### Custom Skill Format

```markdown
---
name: my-custom-skill
description: What this skill does
context: main
model: sonnet
subagents: [debug-engineer, code-reviewer]
triggers:
  - condition: keyword OR pattern
    priority: 7
    requiresHumanInteraction: false
    targetAgent: agent-name
    action: route_to_agent
---

You are the [Skill Name] skill.

Your purpose:
- List your objectives
- Define your capabilities

[Additional instructions...]
```

## Best Practices

1. **Use problem-solver skill** for automatic intelligent routing
2. **Check priorities** - critical tasks get higher priority
3. **Human interaction** - respect requiresHumanInteraction flags
4. **Direct execution** - use execute_subagent when you know the right agent
5. **Trigger specificity** - make trigger conditions specific to avoid false matches
6. **Monitor execution** - check skill execution history for debugging

## Integration with GOTCHA & ATLAS

- **GOTCHA**: Skills integrate with thinking mechanism for decision filtering
- **ATLAS**: atlas-orchestrator skill manages ATLAS process execution
- **Thinking**: All agents filter actions through purpose-based evaluation
- **Database**: All skill executions tracked in memory database
- **Hooks**: Skills can define lifecycle hooks for automation

---

**AGI-MCP** - Building towards Artificial General Intelligence through intelligent orchestration 🎯

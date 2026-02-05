# AGI-MCP Memory System Documentation

## Overview

The AGI-MCP memory system provides persistent, structured storage for cognitive operations using SQLite. It implements the GOTCHA framework's 6-layer architecture and ATLAS process tracking with optimized query performance and session management.

## Table of Contents

- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [GOTCHA Layer Storage](#gotcha-layer-storage)
- [ATLAS Process Tracking](#atlas-process-tracking)
- [Memory Operations](#memory-operations)
- [Query Examples](#query-examples)
- [Session Management](#session-management)
- [Performance Optimization](#performance-optimization)

## Architecture

### Storage Location

```
AGI-MCP/
├── data/
│   └── agi-mcp.db          # SQLite database (auto-created)
└── memory/
    ├── MEMORY.md           # Memory system documentation
    └── logs/
        └── session-*.log   # Session execution logs
```

### Initialization

The memory system initializes automatically on first run:

```typescript
// Automatic initialization flow
1. Check for data/ directory → Create if missing
2. Initialize SQLite database
3. Create schema (tables, indices)
4. Set up session tracking
5. Create memory/logs/ directory
6. Generate MEMORY.md documentation
```

### Database Technology

- **Engine**: SQLite 3 (via better-sqlite3)
- **Mode**: WAL (Write-Ahead Logging)
- **Persistence**: File-based (data/agi-mcp.db)
- **Concurrency**: Single-writer, multiple-reader
- **Transactions**: Implicit (auto-commit by default)

## Database Schema

### Complete Table Structure

```sql
-- GOTCHA Framework Tables (6 layers)

CREATE TABLE goals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,              -- ISO 8601 format
  goal TEXT NOT NULL,                   -- Goal description
  priority INTEGER DEFAULT 5,           -- 1-10 priority scale
  status TEXT DEFAULT 'active',         -- 'active', 'completed', 'abandoned'
  metadata TEXT                         -- JSON-encoded context
);

CREATE TABLE observations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  observation TEXT NOT NULL,            -- Observation content
  source TEXT,                          -- Origin (user, system, subagent)
  metadata TEXT                         -- JSON-encoded context
);

CREATE TABLE thoughts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  thought TEXT NOT NULL,                -- Thought content
  reasoning TEXT,                       -- Reasoning process
  metadata TEXT                         -- JSON-encoded context
);

CREATE TABLE commands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  command TEXT NOT NULL,                -- Command description
  parameters TEXT,                      -- JSON-encoded parameters
  result TEXT,                          -- Execution result
  status TEXT DEFAULT 'pending',        -- 'pending', 'completed', 'failed'
  metadata TEXT                         -- JSON-encoded context
);

CREATE TABLE hypotheses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  hypothesis TEXT NOT NULL,             -- Hypothesis statement
  prediction TEXT,                      -- Expected outcome
  confidence REAL,                      -- 0.0 - 1.0 confidence score
  validated INTEGER DEFAULT 0,          -- 0 (false) or 1 (true)
  metadata TEXT                         -- JSON-encoded context
);

CREATE TABLE assessments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  assessment TEXT NOT NULL,             -- Assessment content
  performance_score REAL,               -- 0.0 - 1.0 performance rating
  learnings TEXT,                       -- Key takeaways
  metadata TEXT                         -- JSON-encoded context
);

-- ATLAS Process Table

CREATE TABLE atlas_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  step TEXT NOT NULL,                   -- 'Analyze', 'Task Breakdown', 'Learn', 'Act', 'Synthesize'
  task_id TEXT NOT NULL,                -- Task identifier
  content TEXT NOT NULL,                -- Step-specific data (JSON)
  status TEXT DEFAULT 'pending',        -- 'pending', 'completed', 'failed'
  metadata TEXT                         -- JSON-encoded context
);

-- Generic Memory Table

CREATE TABLE memory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  layer TEXT NOT NULL,                  -- Memory layer/category
  content TEXT NOT NULL,                -- Memory content
  metadata TEXT                         -- JSON-encoded context
);

-- Session Tracking

CREATE TABLE sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time TEXT NOT NULL,             -- Session start timestamp
  end_time TEXT,                        -- Session end timestamp (NULL if active)
  status TEXT DEFAULT 'active',         -- 'active', 'completed', 'crashed'
  summary TEXT                          -- Session summary
);
```

### Performance Indices

```sql
-- Optimized indices for common queries
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_commands_status ON commands(status);
CREATE INDEX idx_atlas_task ON atlas_steps(task_id);
CREATE INDEX idx_memory_layer ON memory(layer);
CREATE INDEX idx_sessions_status ON sessions(status);
```

## GOTCHA Layer Storage

### Layer 1: Goals

**Purpose**: Define and track objectives

**Storage**:
```typescript
interface Goal {
  id: number;
  timestamp: string;      // ISO 8601
  goal: string;
  priority: number;       // 1-10 scale
  status: string;         // 'active' | 'completed' | 'abandoned'
  metadata?: object;
}
```

**Operations**:
```typescript
// Add goal
const goalId = db.addGoal('Implement user authentication', 8);

// Get active goals
const activeGoals = db.getActiveGoals();

// Update goal status
db.updateGoalStatus(goalId, 'completed');

// Get goals by priority
const highPriority = db.getGoalsByPriority(8, 10);
```

**Query Examples**:
```sql
-- Active goals by priority
SELECT * FROM goals 
WHERE status = 'active' 
ORDER BY priority DESC, timestamp DESC;

-- Goals completed today
SELECT * FROM goals 
WHERE status = 'completed' 
  AND DATE(timestamp) = DATE('now');

-- High-priority incomplete goals
SELECT * FROM goals 
WHERE status = 'active' 
  AND priority >= 8;
```

### Layer 2: Observations

**Purpose**: Record environmental state and perceptions

**Storage**:
```typescript
interface Observation {
  id: number;
  timestamp: string;
  observation: string;
  source?: string;        // 'user' | 'system' | 'subagent' | specific source
  metadata?: object;
}
```

**Operations**:
```typescript
// Record observation
const obsId = db.addObservation(
  'User requested authentication feature',
  'user',
  { context: 'feature-request' }
);

// Get recent observations
const recent = db.getRecentObservations(10);

// Get observations by source
const userObs = db.getObservationsBySource('user');
```

**Query Examples**:
```sql
-- Observations from last hour
SELECT * FROM observations 
WHERE timestamp >= datetime('now', '-1 hour')
ORDER BY timestamp DESC;

-- Observations by source
SELECT source, COUNT(*) as count 
FROM observations 
GROUP BY source;

-- Search observations
SELECT * FROM observations 
WHERE observation LIKE '%authentication%';
```

### Layer 3: Thoughts

**Purpose**: Store reasoning processes and plans

**Storage**:
```typescript
interface Thought {
  id: number;
  timestamp: string;
  thought: string;
  reasoning?: string;
  metadata?: object;
}
```

**Operations**:
```typescript
// Record thought
const thoughtId = db.addThought(
  'Need to implement JWT-based authentication',
  'Stateless tokens better for scalability',
  { related_goal: goalId }
);

// Get recent thoughts
const thoughts = db.getRecentThoughts(20);

// Search thoughts by reasoning
const jwtThoughts = db.searchThoughts('JWT');
```

**Query Examples**:
```sql
-- Recent reasoning processes
SELECT thought, reasoning, timestamp 
FROM thoughts 
ORDER BY timestamp DESC 
LIMIT 10;

-- Thoughts related to specific topic
SELECT * FROM thoughts 
WHERE thought LIKE '%security%' 
   OR reasoning LIKE '%security%';

-- Thought timeline
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as thought_count
FROM thoughts 
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

### Layer 4: Commands

**Purpose**: Track executed actions

**Storage**:
```typescript
interface Command {
  id: number;
  timestamp: string;
  command: string;
  parameters?: object;
  result?: string;
  status: string;         // 'pending' | 'completed' | 'failed'
  metadata?: object;
}
```

**Operations**:
```typescript
// Execute command
const cmdId = db.addCommand(
  'create_auth_module',
  { type: 'JWT', expiry: '24h' }
);

// Update command result
db.updateCommandResult(cmdId, 'Module created successfully', 'completed');

// Get pending commands
const pending = db.getPendingCommands();

// Get command history
const history = db.getCommandHistory(50);
```

**Query Examples**:
```sql
-- Failed commands for debugging
SELECT * FROM commands 
WHERE status = 'failed' 
ORDER BY timestamp DESC;

-- Command success rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM commands), 2) as percentage
FROM commands 
GROUP BY status;

-- Recent command activity
SELECT command, status, timestamp 
FROM commands 
WHERE timestamp >= datetime('now', '-1 day')
ORDER BY timestamp DESC;
```

### Layer 5: Hypotheses

**Purpose**: Store predictions and expectations

**Storage**:
```typescript
interface Hypothesis {
  id: number;
  timestamp: string;
  hypothesis: string;
  prediction?: string;
  confidence: number;     // 0.0 - 1.0
  validated: boolean;     // 0 or 1
  metadata?: object;
}
```

**Operations**:
```typescript
// Form hypothesis
const hypId = db.addHypothesis(
  'JWT implementation will improve scalability',
  'Response times under 100ms',
  0.85
);

// Validate hypothesis
db.validateHypothesis(hypId, true);

// Get high-confidence hypotheses
const confident = db.getHypothesesByConfidence(0.8, 1.0);
```

**Query Examples**:
```sql
-- Validated vs unvalidated hypotheses
SELECT 
  validated,
  COUNT(*) as count,
  AVG(confidence) as avg_confidence
FROM hypotheses 
GROUP BY validated;

-- High-confidence unvalidated predictions
SELECT hypothesis, prediction, confidence 
FROM hypotheses 
WHERE validated = 0 
  AND confidence >= 0.8
ORDER BY confidence DESC;

-- Hypothesis accuracy
SELECT 
  CASE 
    WHEN validated = 1 THEN 'Validated'
    ELSE 'Not Validated'
  END as status,
  AVG(confidence) as avg_confidence,
  COUNT(*) as count
FROM hypotheses 
GROUP BY validated;
```

### Layer 6: Assessments

**Purpose**: Evaluate performance and capture learnings

**Storage**:
```typescript
interface Assessment {
  id: number;
  timestamp: string;
  assessment: string;
  performance_score?: number;  // 0.0 - 1.0
  learnings?: string;
  metadata?: object;
}
```

**Operations**:
```typescript
// Record assessment
const assessId = db.addAssessment(
  'Authentication module completed successfully',
  0.92,
  'JWT works well, consider refresh tokens for better UX'
);

// Get recent assessments
const assessments = db.getRecentAssessments(10);

// Get high-performing assessments
const topPerformance = db.getAssessmentsByScore(0.9, 1.0);
```

**Query Examples**:
```sql
-- Performance trends
SELECT 
  DATE(timestamp) as date,
  AVG(performance_score) as avg_score,
  COUNT(*) as count
FROM assessments 
WHERE performance_score IS NOT NULL
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Top learnings
SELECT assessment, learnings, performance_score 
FROM assessments 
WHERE learnings IS NOT NULL 
  AND performance_score >= 0.8
ORDER BY performance_score DESC;

-- Recent performance summary
SELECT 
  COUNT(*) as total_assessments,
  AVG(performance_score) as average_score,
  MIN(performance_score) as lowest_score,
  MAX(performance_score) as highest_score
FROM assessments 
WHERE timestamp >= datetime('now', '-7 days');
```

## ATLAS Process Tracking

### ATLAS Steps Table

**5-Step Process**: Analyze → Task Breakdown → Learn → Act → Synthesize

**Storage**:
```typescript
interface ATLASStep {
  id: number;
  timestamp: string;
  step: string;           // Step name
  task_id: string;        // Task identifier
  content: string;        // JSON-encoded step data
  status: string;         // 'pending' | 'completed' | 'failed'
  metadata?: object;
}
```

### Step 1: Analyze

```typescript
// Record analysis
db.addATLASStep('Analyze', 'task-001', JSON.stringify({
  complexity: 'medium',
  requirements: ['JWT library', 'user model', 'auth routes'],
  estimatedTime: '4 hours'
}));
```

### Step 2: Task Breakdown

```typescript
// Record breakdown
db.addATLASStep('Task Breakdown', 'task-001', JSON.stringify({
  subtasks: [
    'Install JWT library',
    'Create auth middleware',
    'Add login endpoint',
    'Add token verification',
    'Write tests'
  ],
  estimatedSteps: 5
}));
```

### Step 3: Learn

```typescript
// Record learning
db.addATLASStep('Learn', 'task-001', JSON.stringify({
  requiredKnowledge: ['JWT specs', 'security best practices'],
  resources: ['jwt.io', 'OWASP guidelines'],
  capabilities: ['has_jwt_library', 'knows_express']
}));
```

### Step 4: Act

```typescript
// Record action
db.addATLASStep('Act', 'task-001', JSON.stringify({
  executedSubtasks: [
    { task: 'Install JWT library', status: 'completed' },
    { task: 'Create middleware', status: 'completed' }
  ],
  progress: '2/5'
}));
```

### Step 5: Synthesize

```typescript
// Record synthesis
db.addATLASStep('Synthesize', 'task-001', JSON.stringify({
  results: 'Authentication implemented successfully',
  insights: 'Consider adding refresh token rotation',
  performanceScore: 0.9
}));
```

### ATLAS Query Examples

```sql
-- Complete task history
SELECT step, content, status, timestamp 
FROM atlas_steps 
WHERE task_id = 'task-001'
ORDER BY timestamp ASC;

-- Active tasks
SELECT DISTINCT task_id 
FROM atlas_steps 
WHERE status = 'pending';

-- Step distribution
SELECT 
  step,
  COUNT(*) as count,
  AVG(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) as success_rate
FROM atlas_steps 
GROUP BY step;

-- Failed steps for debugging
SELECT task_id, step, content 
FROM atlas_steps 
WHERE status = 'failed'
ORDER BY timestamp DESC;

-- Task completion timeline
SELECT 
  task_id,
  MIN(timestamp) as start_time,
  MAX(timestamp) as end_time,
  COUNT(*) as total_steps
FROM atlas_steps 
GROUP BY task_id
ORDER BY start_time DESC;
```

## Memory Operations

### Database Class API

```typescript
class MemoryDatabase {
  // GOTCHA Operations
  addGoal(goal: string, priority?: number, metadata?: any): number;
  addObservation(observation: string, source?: string, metadata?: any): number;
  addThought(thought: string, reasoning?: string, metadata?: any): number;
  addCommand(command: string, parameters?: any, metadata?: any): number;
  addHypothesis(hypothesis: string, prediction?: string, confidence?: number, metadata?: any): number;
  addAssessment(assessment: string, score?: number, learnings?: string, metadata?: any): number;
  
  // ATLAS Operations
  addATLASStep(step: string, taskId: string, content: string, metadata?: any): number;
  updateATLASStepStatus(id: number, status: string): void;
  getATLASHistory(taskId: string): ATLASStep[];
  
  // Query Operations
  getActiveGoals(): any[];
  getRecentObservations(limit?: number): any[];
  getPendingCommands(): any[];
  getMemory(layer: string, limit?: number): any[];
  
  // Session Operations
  startSession(): number;
  endSession(sessionId: number, summary?: string): void;
  getActiveSession(): any;
  
  // Update Operations
  updateGoalStatus(id: number, status: string): void;
  updateCommandResult(id: number, result: string, status: string): void;
  validateHypothesis(id: number, validated: boolean): void;
}
```

### Generic Memory Storage

For cross-layer or custom data:

```typescript
// Add generic memory
db.addMemory('custom-layer', 'Content here', { type: 'note' });

// Query by layer
const customData = db.getMemory('custom-layer', 50);

// Metadata filtering
const filtered = db.getMemoryWithMetadata('custom-layer', { type: 'note' });
```

## Query Examples

### Cross-Layer Queries

```sql
-- Complete GOTCHA cycle for a goal
SELECT 
  'Goal' as layer, goal as content, timestamp 
FROM goals WHERE id = ?
UNION ALL
SELECT 
  'Observation' as layer, observation as content, timestamp 
FROM observations WHERE metadata LIKE '%goal_id":' || ? || '%'
UNION ALL
SELECT 
  'Thought' as layer, thought as content, timestamp 
FROM thoughts WHERE metadata LIKE '%goal_id":' || ? || '%'
ORDER BY timestamp ASC;

-- Activity summary
SELECT 'Goals' as type, COUNT(*) as count FROM goals
UNION ALL
SELECT 'Observations', COUNT(*) FROM observations
UNION ALL
SELECT 'Thoughts', COUNT(*) FROM thoughts
UNION ALL
SELECT 'Commands', COUNT(*) FROM commands
UNION ALL
SELECT 'Hypotheses', COUNT(*) FROM hypotheses
UNION ALL
SELECT 'Assessments', COUNT(*) FROM assessments;

-- Recent activity across all layers
SELECT 'Goal' as type, goal as content, timestamp FROM goals
WHERE timestamp >= datetime('now', '-1 hour')
UNION ALL
SELECT 'Observation', observation, timestamp FROM observations
WHERE timestamp >= datetime('now', '-1 hour')
UNION ALL
SELECT 'Thought', thought, timestamp FROM thoughts
WHERE timestamp >= datetime('now', '-1 hour')
ORDER BY timestamp DESC;
```

### Analytics Queries

```sql
-- Productivity metrics
SELECT 
  DATE(timestamp) as date,
  COUNT(DISTINCT CASE WHEN status = 'completed' THEN id END) as completed_goals,
  COUNT(DISTINCT CASE WHEN status = 'active' THEN id END) as active_goals
FROM goals
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Command execution stats
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as total_commands,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful,
  SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
  ROUND(AVG(CASE WHEN status = 'completed' THEN 1.0 ELSE 0.0 END) * 100, 2) as success_rate
FROM commands
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Hypothesis accuracy over time
SELECT 
  DATE(timestamp) as date,
  COUNT(*) as total_hypotheses,
  SUM(validated) as validated_count,
  AVG(confidence) as avg_confidence,
  ROUND(SUM(validated) * 100.0 / COUNT(*), 2) as validation_rate
FROM hypotheses
GROUP BY DATE(timestamp)
ORDER BY date DESC;
```

## Session Management

### Session Lifecycle

```typescript
// 1. Start session
const sessionId = db.startSession();

// 2. Work (GOTCHA/ATLAS operations)
// ... application logic ...

// 3. End session
db.endSession(sessionId, 'Completed authentication implementation');
```

### Session Queries

```sql
-- Active sessions
SELECT * FROM sessions 
WHERE status = 'active';

-- Session duration
SELECT 
  id,
  start_time,
  end_time,
  ROUND((julianday(end_time) - julianday(start_time)) * 24, 2) as duration_hours
FROM sessions 
WHERE end_time IS NOT NULL
ORDER BY start_time DESC;

-- Session productivity
SELECT 
  s.id,
  s.start_time,
  s.summary,
  COUNT(DISTINCT g.id) as goals_set,
  COUNT(DISTINCT c.id) as commands_executed,
  COUNT(DISTINCT a.id) as assessments_made
FROM sessions s
LEFT JOIN goals g ON DATE(g.timestamp) = DATE(s.start_time)
LEFT JOIN commands c ON DATE(c.timestamp) = DATE(s.start_time)
LEFT JOIN assessments a ON DATE(a.timestamp) = DATE(s.start_time)
WHERE s.end_time IS NOT NULL
GROUP BY s.id
ORDER BY s.start_time DESC;
```

### Session Summary Tool

```typescript
// Get session summary
const summary = await tools.handleToolCall('get_session_summary', {
  session_id?: sessionId  // Optional, defaults to active session
});

// Returns:
{
  session_id: number,
  start_time: string,
  duration: string,
  goals: { active: number, completed: number },
  observations: number,
  thoughts: number,
  commands: { total: number, completed: number, failed: number },
  hypotheses: number,
  assessments: { count: number, avg_score: number },
  atlas_tasks: string[]
}
```

## Performance Optimization

### Indexing Strategy

```sql
-- Primary indices (created automatically)
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_commands_status ON commands(status);
CREATE INDEX idx_atlas_task ON atlas_steps(task_id);
CREATE INDEX idx_memory_layer ON memory(layer);
CREATE INDEX idx_sessions_status ON sessions(status);

-- Additional indices for common queries
CREATE INDEX idx_goals_priority ON goals(priority DESC);
CREATE INDEX idx_observations_source ON observations(source);
CREATE INDEX idx_hypotheses_confidence ON hypotheses(confidence DESC);
CREATE INDEX idx_assessments_score ON assessments(performance_score DESC);

-- Timestamp indices for time-based queries
CREATE INDEX idx_goals_timestamp ON goals(timestamp);
CREATE INDEX idx_observations_timestamp ON observations(timestamp);
CREATE INDEX idx_thoughts_timestamp ON thoughts(timestamp);
```

### Query Optimization Tips

1. **Use LIMIT for large result sets**:
```sql
SELECT * FROM observations 
ORDER BY timestamp DESC 
LIMIT 100;
```

2. **Leverage indices with WHERE clauses**:
```sql
-- Good: Uses idx_goals_status
SELECT * FROM goals WHERE status = 'active';

-- Bad: Doesn't use index
SELECT * FROM goals WHERE LOWER(status) = 'active';
```

3. **Use prepared statements**:
```typescript
const stmt = db.prepare('SELECT * FROM goals WHERE status = ?');
const active = stmt.all('active');
```

4. **Batch insertions for performance**:
```typescript
const insertGoal = db.prepare('INSERT INTO goals (timestamp, goal, priority) VALUES (?, ?, ?)');

const insertMany = db.transaction((goals) => {
  for (const goal of goals) {
    insertGoal.run(new Date().toISOString(), goal.text, goal.priority);
  }
});

insertMany(goalsArray);
```

### Database Maintenance

```sql
-- Analyze for query optimization
ANALYZE;

-- Vacuum to reclaim space
VACUUM;

-- Check integrity
PRAGMA integrity_check;

-- View database statistics
PRAGMA table_info(goals);
PRAGMA index_list(goals);
```

## Backup and Recovery

### Manual Backup

```bash
# Backup database
cp data/agi-mcp.db data/agi-mcp.db.backup

# Restore from backup
cp data/agi-mcp.db.backup data/agi-mcp.db
```

### Programmatic Backup

```typescript
import { copyFileSync } from 'fs';

// Create backup with timestamp
const timestamp = new Date().toISOString().replace(/:/g, '-');
const backupPath = `data/agi-mcp.db.${timestamp}.backup`;
copyFileSync('data/agi-mcp.db', backupPath);
```

### Export to JSON

```typescript
// Export all data
const export = {
  goals: db.prepare('SELECT * FROM goals').all(),
  observations: db.prepare('SELECT * FROM observations').all(),
  thoughts: db.prepare('SELECT * FROM thoughts').all(),
  commands: db.prepare('SELECT * FROM commands').all(),
  hypotheses: db.prepare('SELECT * FROM hypotheses').all(),
  assessments: db.prepare('SELECT * FROM assessments').all(),
  atlas_steps: db.prepare('SELECT * FROM atlas_steps').all(),
  sessions: db.prepare('SELECT * FROM sessions').all()
};

writeFileSync('export.json', JSON.stringify(export, null, 2));
```

## Advanced Topics

### Metadata Best Practices

```typescript
// Structured metadata
db.addGoal('Implement feature X', 8, {
  category: 'feature',
  epic: 'auth-system',
  assignee: 'ai-agent',
  tags: ['security', 'backend'],
  related_goals: [12, 15]
});

// Query by metadata
const authGoals = db.prepare(`
  SELECT * FROM goals 
  WHERE metadata LIKE '%"category":"feature"%'
    AND metadata LIKE '%"epic":"auth-system"%'
`).all();
```

### Custom Views

```sql
-- Create view for active work
CREATE VIEW active_work AS
SELECT 
  g.id as goal_id,
  g.goal,
  g.priority,
  COUNT(DISTINCT c.id) as commands_executed,
  COUNT(DISTINCT t.id) as thoughts_recorded
FROM goals g
LEFT JOIN commands c ON c.metadata LIKE '%"goal_id":' || g.id || '%'
LEFT JOIN thoughts t ON t.metadata LIKE '%"goal_id":' || g.id || '%'
WHERE g.status = 'active'
GROUP BY g.id
ORDER BY g.priority DESC;

-- Use view
SELECT * FROM active_work;
```

### Triggers for Automation

```sql
-- Auto-update goal status when all related commands complete
CREATE TRIGGER update_goal_status
AFTER UPDATE ON commands
WHEN NEW.status = 'completed'
BEGIN
  UPDATE goals 
  SET status = 'completed'
  WHERE id = (
    SELECT CAST(json_extract(NEW.metadata, '$.goal_id') AS INTEGER)
  )
  AND NOT EXISTS (
    SELECT 1 FROM commands 
    WHERE status = 'pending' 
    AND metadata LIKE '%"goal_id":' || goals.id || '%'
  );
END;
```

## Related Documentation

- [API Documentation](API.md) - MCP tool reference
- [Getting Started](GETTING_STARTED.md) - Setup guide
- [Agents Documentation](AGENTS.md) - Subagent system
- [Architecture](../ARCHITECTURE.md) - System design

---

**AGI-MCP Memory System** - Persistent, structured cognitive storage for AGI-like operations

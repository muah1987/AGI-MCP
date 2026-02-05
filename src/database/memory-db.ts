import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface MemoryEntry {
  id?: number;
  timestamp: string;
  layer: string;
  content: string;
  metadata?: string;
}

export interface ATLASStep {
  id?: number;
  timestamp: string;
  step: string;
  task_id: string;
  content: string;
  status: string;
}

export class MemoryDatabase {
  private db: Database.Database;
  private dbPath: string;

  constructor(dbPath?: string) {
    // Use provided path or default to data/agi-mcp.db
    this.dbPath = dbPath || join(__dirname, '../../data/agi-mcp.db');
    
    // Ensure data directory exists
    const dataDir = dirname(this.dbPath);
    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    this.db = new Database(this.dbPath);
    this.initializeSchema();
  }

  private initializeSchema(): void {
    // GOTCHA Framework tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS goals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        goal TEXT NOT NULL,
        priority INTEGER DEFAULT 5,
        status TEXT DEFAULT 'active',
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS observations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        observation TEXT NOT NULL,
        source TEXT,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS thoughts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        thought TEXT NOT NULL,
        reasoning TEXT,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS commands (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        command TEXT NOT NULL,
        parameters TEXT,
        result TEXT,
        status TEXT DEFAULT 'pending',
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS hypotheses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        hypothesis TEXT NOT NULL,
        prediction TEXT,
        confidence REAL,
        validated INTEGER DEFAULT 0,
        metadata TEXT
      );

      CREATE TABLE IF NOT EXISTS assessments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        assessment TEXT NOT NULL,
        performance_score REAL,
        learnings TEXT,
        metadata TEXT
      );

      -- ATLAS Process table
      CREATE TABLE IF NOT EXISTS atlas_steps (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        step TEXT NOT NULL,
        task_id TEXT NOT NULL,
        content TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        metadata TEXT
      );

      -- General memory table for cross-layer entries
      CREATE TABLE IF NOT EXISTS memory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        layer TEXT NOT NULL,
        content TEXT NOT NULL,
        metadata TEXT
      );

      -- Session tracking
      CREATE TABLE IF NOT EXISTS sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_time TEXT NOT NULL,
        end_time TEXT,
        status TEXT DEFAULT 'active',
        summary TEXT
      );
    `);

    // Create indices for better query performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);
      CREATE INDEX IF NOT EXISTS idx_commands_status ON commands(status);
      CREATE INDEX IF NOT EXISTS idx_atlas_task ON atlas_steps(task_id);
      CREATE INDEX IF NOT EXISTS idx_memory_layer ON memory(layer);
      CREATE INDEX IF NOT EXISTS idx_sessions_status ON sessions(status);
    `);
  }

  // Generic memory operations
  addMemory(layer: string, content: string, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO memory (timestamp, layer, content, metadata)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      layer,
      content,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  getMemoryByLayer(layer: string, limit: number = 100): MemoryEntry[] {
    const stmt = this.db.prepare(`
      SELECT * FROM memory WHERE layer = ? ORDER BY timestamp DESC LIMIT ?
    `);
    return stmt.all(layer, limit) as MemoryEntry[];
  }

  // GOTCHA Framework operations
  addGoal(goal: string, priority: number = 5, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO goals (timestamp, goal, priority, metadata)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      goal,
      priority,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  getActiveGoals(): any[] {
    const stmt = this.db.prepare(`
      SELECT * FROM goals WHERE status = 'active' ORDER BY priority DESC, timestamp DESC
    `);
    return stmt.all();
  }

  addObservation(observation: string, source?: string, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO observations (timestamp, observation, source, metadata)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      observation,
      source || null,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  addThought(thought: string, reasoning?: string, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO thoughts (timestamp, thought, reasoning, metadata)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      thought,
      reasoning || null,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  addCommand(command: string, parameters?: any, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO commands (timestamp, command, parameters, metadata)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      command,
      parameters ? JSON.stringify(parameters) : null,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  updateCommandResult(id: number, result: string, status: string): void {
    const stmt = this.db.prepare(`
      UPDATE commands SET result = ?, status = ? WHERE id = ?
    `);
    stmt.run(result, status, id);
  }

  addHypothesis(hypothesis: string, prediction?: string, confidence?: number, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO hypotheses (timestamp, hypothesis, prediction, confidence, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      hypothesis,
      prediction || null,
      confidence || null,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  addAssessment(assessment: string, performanceScore?: number, learnings?: string, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO assessments (timestamp, assessment, performance_score, learnings, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      assessment,
      performanceScore || null,
      learnings || null,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  // ATLAS Process operations
  addATLASStep(step: string, taskId: string, content: string, metadata?: any): number {
    const stmt = this.db.prepare(`
      INSERT INTO atlas_steps (timestamp, step, task_id, content, metadata)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      new Date().toISOString(),
      step,
      taskId,
      content,
      metadata ? JSON.stringify(metadata) : null
    );
    return info.lastInsertRowid as number;
  }

  updateATLASStepStatus(id: number, status: string): void {
    const stmt = this.db.prepare(`
      UPDATE atlas_steps SET status = ? WHERE id = ?
    `);
    stmt.run(status, id);
  }

  getATLASStepsByTask(taskId: string): ATLASStep[] {
    const stmt = this.db.prepare(`
      SELECT * FROM atlas_steps WHERE task_id = ? ORDER BY timestamp ASC
    `);
    return stmt.all(taskId) as ATLASStep[];
  }

  // Session management
  startSession(): number {
    const stmt = this.db.prepare(`
      INSERT INTO sessions (start_time) VALUES (?)
    `);
    const info = stmt.run(new Date().toISOString());
    return info.lastInsertRowid as number;
  }

  endSession(id: number, summary?: string): void {
    const stmt = this.db.prepare(`
      UPDATE sessions SET end_time = ?, status = 'completed', summary = ? WHERE id = ?
    `);
    stmt.run(new Date().toISOString(), summary || null, id);
  }

  // Utility methods
  getAllMemory(limit: number = 1000): MemoryEntry[] {
    const stmt = this.db.prepare(`
      SELECT * FROM memory ORDER BY timestamp DESC LIMIT ?
    `);
    return stmt.all(limit) as MemoryEntry[];
  }

  close(): void {
    this.db.close();
  }
}

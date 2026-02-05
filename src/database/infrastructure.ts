import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Memory Infrastructure Initialization
 * Ensures all required directories and files exist for the AGI-MCP system
 */

export class MemoryInfrastructure {
  private rootDir: string;
  private memoryDir: string;
  private logsDir: string;
  private dataDir: string;
  private memoryFile: string;

  constructor(rootDir?: string) {
    this.rootDir = rootDir || join(__dirname, '../..');
    this.memoryDir = join(this.rootDir, 'memory');
    this.logsDir = join(this.memoryDir, 'logs');
    this.dataDir = join(this.rootDir, 'data');
    this.memoryFile = join(this.memoryDir, 'MEMORY.md');
  }

  /**
   * Check if memory infrastructure exists
   */
  checkInfrastructure(): boolean {
    return existsSync(this.memoryFile);
  }

  /**
   * Create memory infrastructure if it doesn't exist
   */
  ensureInfrastructure(): void {
    console.log('[Memory Infrastructure] Checking memory infrastructure...');

    if (this.checkInfrastructure()) {
      console.log('[Memory Infrastructure] Memory infrastructure already exists.');
      return;
    }

    console.log('[Memory Infrastructure] Memory infrastructure not found. Creating...');
    this.createInfrastructure();
    console.log('[Memory Infrastructure] Memory infrastructure created successfully.');
  }

  /**
   * Create all required directories and files
   */
  private createInfrastructure(): void {
    // Create directories
    this.createDirectories();

    // Create MEMORY.md file
    this.createMemoryFile();

    // Create initial log file
    this.createInitialLog();
  }

  /**
   * Create directory structure
   */
  private createDirectories(): void {
    const directories = [
      this.memoryDir,
      this.logsDir,
      this.dataDir
    ];

    for (const dir of directories) {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
        console.log(`[Memory Infrastructure] Created directory: ${dir}`);
      }
    }
  }

  /**
   * Create MEMORY.md file
   */
  private createMemoryFile(): void {
    const timestamp = new Date().toISOString();
    const content = `# AGI-MCP Memory System

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
- **Database**: SQLite database (\`data/agi-mcp.db\`) - Primary source of truth
- **Logs**: Session logs in \`memory/logs/\`
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
Created: ${timestamp}
`;

    writeFileSync(this.memoryFile, content, 'utf-8');
    console.log(`[Memory Infrastructure] Created MEMORY.md file`);
  }

  /**
   * Create initial log file
   */
  private createInitialLog(): void {
    const timestamp = new Date().toISOString();
    const logFile = join(this.logsDir, `session-${timestamp}.log`);
    const content = `AGI-MCP Session Log
Started: ${timestamp}

Memory infrastructure initialized successfully.
GOTCHA Framework: Ready
ATLAS Process: Ready
Database: Initialized

System ready for operations.
`;

    writeFileSync(logFile, content, 'utf-8');
    console.log(`[Memory Infrastructure] Created initial log file: ${logFile}`);
  }

  /**
   * Get infrastructure status
   */
  getStatus(): any {
    return {
      memoryDirExists: existsSync(this.memoryDir),
      logsDirExists: existsSync(this.logsDir),
      dataDirExists: existsSync(this.dataDir),
      memoryFileExists: existsSync(this.memoryFile),
      paths: {
        memoryDir: this.memoryDir,
        logsDir: this.logsDir,
        dataDir: this.dataDir,
        memoryFile: this.memoryFile
      }
    };
  }
}

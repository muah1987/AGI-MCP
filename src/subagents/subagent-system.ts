import { MemoryDatabase } from '../database/memory-db.js';
import { GOTCHAFramework } from '../gotcha/framework.js';
import { ATLASProcess } from '../atlas/process.js';
import { HookConfig } from '../hooks/hook-system.js';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Subagent System for AGI-MCP Server
 * Provides specialized AI assistants for specific tasks
 */

export interface SubagentConfig {
  name: string;
  description: string;
  systemPrompt: string;
  tools?: string[];
  disallowedTools?: string[];
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
  permissionMode?: 'default' | 'acceptEdits' | 'dontAsk' | 'bypassPermissions' | 'plan';
  skills?: string[];
  hooks?: HookConfig;
  color?: string;
}

export interface SubagentInstance {
  id: string;
  config: SubagentConfig;
  db: MemoryDatabase;
  gotcha: GOTCHAFramework;
  atlas: ATLASProcess;
  context: string[];
  status: 'active' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  parentSessionId?: string;
}

export class SubagentSystem {
  private subagents: Map<string, SubagentConfig> = new Map();
  private instances: Map<string, SubagentInstance> = new Map();
  private db: MemoryDatabase;
  private projectDir: string;
  private userDir: string;

  constructor(db: MemoryDatabase, projectDir: string, userDir?: string) {
    this.db = db;
    this.projectDir = projectDir;
    this.userDir = userDir || join(process.env.HOME || '~', '.agi-mcp', 'subagents');
  }

  /**
   * Load subagents from all sources (built-in, user, project, plugins)
   */
  loadSubagents(): void {
    console.log('[Subagents] Loading subagent configurations...');

    // Load built-in subagents
    this.loadBuiltInSubagents();

    // Load user-level subagents from ~/.agi-mcp/subagents/
    this.loadSubagentsFromDirectory(this.userDir, 'user');

    // Load project-level subagents from .agi-mcp/subagents/
    const projectSubagentsDir = join(this.projectDir, '.agi-mcp', 'subagents');
    this.loadSubagentsFromDirectory(projectSubagentsDir, 'project');

    console.log(`[Subagents] Loaded ${this.subagents.size} subagent(s)`);
  }

  /**
   * Load built-in subagents
   */
  private loadBuiltInSubagents(): void {
    // Explore - Fast, read-only agent for searching and analyzing codebases
    this.registerSubagent({
      name: 'explore',
      description: 'Fast agent for searching and analyzing codebases. Use for file discovery, code search, and codebase exploration without making changes.',
      systemPrompt: `You are the Explore subagent, optimized for fast codebase analysis.

Your purpose:
- Search and analyze code without making modifications
- Find files and patterns quickly
- Understand codebase structure
- Answer questions about code

You have read-only access. Use memory retrieval tools efficiently.
Provide concise, focused answers.`,
      tools: ['get_memory', 'get_active_goals', 'get_atlas_history'],
      disallowedTools: ['execute_command', 'set_goal', 'execute_atlas_task'],
      model: 'haiku',
      color: 'blue'
    });

    // General-purpose - Capable agent for complex, multi-step tasks
    this.registerSubagent({
      name: 'general-purpose',
      description: 'Capable agent for complex, multi-step tasks requiring both exploration and action. Use for research, multi-step operations, and code modifications.',
      systemPrompt: `You are the General-Purpose subagent for complex tasks.

Your capabilities:
- Complex reasoning and analysis
- Multi-step task execution
- Code modifications and implementations
- Research and synthesis

Use all available tools as needed. Think through problems systematically.
Break down complex tasks into manageable steps.`,
      model: 'inherit',
      color: 'green'
    });

    // Task Executor - Specialized for running commands and tests
    this.registerSubagent({
      name: 'task-executor',
      description: 'Execute commands, run tests, and perform automated tasks. Use for testing, building, and command-line operations.',
      systemPrompt: `You are the Task Executor subagent.

Your focus:
- Execute commands efficiently
- Run tests and report results
- Build and compile code
- Automate repetitive tasks

Provide clear, concise summaries of results.
Report failures with enough detail to diagnose issues.`,
      tools: ['execute_command', 'get_memory', 'assess_performance'],
      model: 'haiku',
      color: 'yellow'
    });

    // Code Reviewer - Read-only code analysis
    this.registerSubagent({
      name: 'code-reviewer',
      description: 'Expert code review specialist. Reviews code for quality, security, and maintainability. Use immediately after writing or modifying code.',
      systemPrompt: `You are a senior code reviewer ensuring high standards of code quality and security.

When invoked:
1. Review the specified code or recent changes
2. Focus on modified areas
3. Begin review immediately

Review checklist:
- Code is clear and readable
- Functions and variables are well-named
- No duplicated code
- Proper error handling
- No exposed secrets or API keys
- Input validation implemented
- Good test coverage
- Performance considerations addressed

Provide feedback organized by priority:
- Critical issues (must fix)
- Warnings (should fix)
- Suggestions (consider improving)

Include specific examples of how to fix issues.`,
      tools: ['get_memory', 'think', 'form_hypothesis', 'assess_performance'],
      disallowedTools: ['execute_command', 'set_goal'],
      model: 'inherit',
      color: 'purple'
    });
  }

  /**
   * Load subagents from a directory
   */
  private loadSubagentsFromDirectory(dir: string, source: string): void {
    if (!existsSync(dir)) {
      return;
    }

    try {
      const files = readdirSync(dir).filter(f => f.endsWith('.md'));
      
      for (const file of files) {
        try {
          const content = readFileSync(join(dir, file), 'utf-8');
          
          // Parse frontmatter manually (simplified version)
          const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]*)$/);
          if (!frontmatterMatch) {
            console.warn(`[Subagents] No frontmatter found in ${file}`);
            continue;
          }

          const [, frontmatterText, systemPrompt] = frontmatterMatch;
          const data: any = {};
          
          // Simple YAML parsing
          frontmatterText.split('\n').forEach(line => {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
              const [, key, value] = match;
              data[key] = value.trim();
            }
          });

          const config: SubagentConfig = {
            name: data.name || file.replace('.md', ''),
            description: data.description || '',
            systemPrompt: systemPrompt.trim(),
            tools: data.tools ? data.tools.split(',').map((t: string) => t.trim()) : undefined,
            disallowedTools: data.disallowedTools ? data.disallowedTools.split(',').map((t: string) => t.trim()) : undefined,
            model: data.model || 'inherit',
            permissionMode: data.permissionMode || 'default',
            skills: data.skills ? data.skills.split(',').map((s: string) => s.trim()) : undefined,
            color: data.color
          };

          this.registerSubagent(config);
          console.log(`[Subagents] Loaded ${source} subagent: ${config.name}`);
        } catch (error) {
          console.warn(`[Subagents] Failed to load ${file}:`, error);
        }
      }
    } catch (error) {
      console.warn(`[Subagents] Failed to read directory ${dir}:`, error);
    }
  }

  /**
   * Register a subagent configuration
   */
  registerSubagent(config: SubagentConfig): void {
    this.subagents.set(config.name, config);
  }

  /**
   * Get a subagent configuration by name
   */
  getSubagent(name: string): SubagentConfig | undefined {
    return this.subagents.get(name);
  }

  /**
   * List all available subagents
   */
  listSubagents(): SubagentConfig[] {
    return Array.from(this.subagents.values());
  }

  /**
   * Create a new subagent instance
   */
  async createInstance(
    subagentName: string,
    task: string,
    parentSessionId?: string
  ): Promise<SubagentInstance | null> {
    const config = this.getSubagent(subagentName);
    if (!config) {
      console.error(`[Subagents] Subagent not found: ${subagentName}`);
      return null;
    }

    const instanceId = `subagent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create isolated database instance for subagent (same DB but tracked separately)
    const subagentDb = this.db;

    // Create isolated GOTCHA and ATLAS instances
    const subagentGotcha = new GOTCHAFramework(subagentDb);
    const subagentAtlas = new ATLASProcess(subagentDb, subagentGotcha);

    const instance: SubagentInstance = {
      id: instanceId,
      config,
      db: subagentDb,
      gotcha: subagentGotcha,
      atlas: subagentAtlas,
      context: [
        config.systemPrompt,
        `\nTask: ${task}`,
        `\nWorking directory: ${this.projectDir}`
      ],
      status: 'active',
      startTime: new Date(),
      parentSessionId
    };

    this.instances.set(instanceId, instance);

    // Record subagent start in database
    subagentDb.addMemory('subagent', JSON.stringify({
      action: 'start',
      instanceId,
      subagentName,
      task,
      timestamp: new Date().toISOString()
    }));

    console.log(`[Subagents] Created instance ${instanceId} for ${subagentName}`);
    return instance;
  }

  /**
   * Execute a task with a subagent
   */
  async executeTask(subagentName: string, task: string, parentSessionId?: string): Promise<any> {
    const instance = await this.createInstance(subagentName, task, parentSessionId);
    if (!instance) {
      return {
        success: false,
        error: `Subagent ${subagentName} not found`
      };
    }

    try {
      console.log(`[Subagents] Executing task with ${subagentName}: ${task}`);

      // Define initial goal
      instance.gotcha.defineGoal(task, 10);

      // Execute using ATLAS process
      const result = await instance.atlas.executeTask({
        id: instance.id,
        description: task
      });

      // Mark as completed
      instance.status = 'completed';
      instance.endTime = new Date();

      // Record completion
      instance.db.addMemory('subagent', JSON.stringify({
        action: 'complete',
        instanceId: instance.id,
        result: 'success',
        timestamp: new Date().toISOString()
      }));

      return {
        success: true,
        instanceId: instance.id,
        subagent: subagentName,
        result: result,
        executionTime: instance.endTime.getTime() - instance.startTime.getTime()
      };
    } catch (error) {
      instance.status = 'failed';
      instance.endTime = new Date();

      instance.db.addMemory('subagent', JSON.stringify({
        action: 'failed',
        instanceId: instance.id,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString()
      }));

      return {
        success: false,
        instanceId: instance.id,
        subagent: subagentName,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Resume a subagent instance
   */
  async resumeInstance(instanceId: string, additionalTask: string): Promise<any> {
    const instance = this.instances.get(instanceId);
    if (!instance) {
      return {
        success: false,
        error: `Instance ${instanceId} not found`
      };
    }

    // Add new task to context
    instance.context.push(`\nAdditional task: ${additionalTask}`);
    instance.status = 'active';

    try {
      // Execute additional task
      const result = await instance.atlas.executeTask({
        id: `${instance.id}-resume-${Date.now()}`,
        description: additionalTask
      });

      instance.status = 'completed';

      return {
        success: true,
        instanceId: instance.id,
        result: result
      };
    } catch (error) {
      instance.status = 'failed';
      return {
        success: false,
        instanceId: instance.id,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  /**
   * Get instance details
   */
  getInstance(instanceId: string): SubagentInstance | undefined {
    return this.instances.get(instanceId);
  }

  /**
   * List all instances
   */
  listInstances(): SubagentInstance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Suggest which subagent to use for a task
   */
  suggestSubagent(taskDescription: string): SubagentConfig | null {
    const taskLower = taskDescription.toLowerCase();
    
    // Simple keyword-based matching
    for (const config of this.subagents.values()) {
      const descLower = config.description.toLowerCase();
      const keywords = descLower.split(' ').filter(w => w.length > 4);
      
      let matchScore = 0;
      for (const keyword of keywords) {
        if (taskLower.includes(keyword)) {
          matchScore++;
        }
      }

      if (matchScore > 2) {
        return config;
      }
    }

    // Check for specific patterns
    if (taskLower.includes('search') || taskLower.includes('find') || taskLower.includes('explore')) {
      return this.getSubagent('explore') || null;
    }

    if (taskLower.includes('test') || taskLower.includes('run') || taskLower.includes('execute')) {
      return this.getSubagent('task-executor') || null;
    }

    if (taskLower.includes('review') || taskLower.includes('analyze') || taskLower.includes('check')) {
      return this.getSubagent('code-reviewer') || null;
    }

    // Default to general-purpose
    return this.getSubagent('general-purpose') || null;
  }
}

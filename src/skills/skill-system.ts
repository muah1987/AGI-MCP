/**
 * AGI-MCP Skill System
 * Orchestrates subagents and provides reusable capabilities
 */

import { SubagentSystem } from '../subagents/subagent-system.js';
import { MemoryDatabase } from '../database/memory-db.js';
import { ThinkingMechanism } from '../gotcha/thinking.js';
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

export interface SkillConfig {
  name: string;
  description: string;
  systemPrompt: string;
  context?: 'main' | 'fork';
  agentType?: string;
  model?: 'sonnet' | 'opus' | 'haiku' | 'inherit';
  tools?: string[];
  subagents?: string[];
  triggers?: TriggerConfig[];
  hooks?: any;
  once?: boolean;
}

export interface TriggerConfig {
  condition: string;
  priority: number;
  requiresHumanInteraction?: boolean;
  targetAgent?: string;
  action: string;
}

export interface SkillExecution {
  skillName: string;
  startTime: Date;
  endTime?: Date;
  status: 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export class SkillSystem {
  private skills: Map<string, SkillConfig> = new Map();
  private executions: Map<string, SkillExecution> = new Map();
  private db: MemoryDatabase;
  private subagents: SubagentSystem;
  private thinking: ThinkingMechanism;
  private projectDir: string;
  private userDir: string;

  constructor(
    db: MemoryDatabase,
    subagents: SubagentSystem,
    thinking: ThinkingMechanism,
    projectDir: string,
    userDir?: string
  ) {
    this.db = db;
    this.subagents = subagents;
    this.thinking = thinking;
    this.projectDir = projectDir;
    this.userDir = userDir || join(process.env.HOME || '~', '.agi-mcp', 'skills');
  }

  /**
   * Load skills from all sources
   */
  loadSkills(): void {
    console.log('[Skills] Loading skill configurations...');

    // Load built-in skills
    this.loadBuiltInSkills();

    // Load user-level skills from ~/.agi-mcp/skills/
    this.loadSkillsFromDirectory(this.userDir, 'user');

    // Load project-level skills from .agi-mcp/skills/
    const projectSkillsDir = join(this.projectDir, '.agi-mcp', 'skills');
    this.loadSkillsFromDirectory(projectSkillsDir, 'project');

    console.log(`[Skills] Loaded ${this.skills.size} skill(s)`);
  }

  /**
   * Load built-in skills
   */
  private loadBuiltInSkills(): void {
    // Problem Solver Skill - Routes issues to specialized agents
    this.registerSkill({
      name: 'problem-solver',
      description: 'Analyzes problems and routes them to the most appropriate specialized agent',
      systemPrompt: `You are the Problem Solver skill for AGI-MCP.

Your purpose:
- Analyze incoming problems and tasks
- Determine which specialized agent is best suited
- Route the task to the appropriate agent
- Monitor execution and escalate if needed

Available specialized agents:
- debug-engineer: For debugging, troubleshooting, and error resolution
- architect: For system design, architecture planning, and technical decisions
- document-writer: For creating documentation, guides, and technical writing
- network-engineer: For network configuration, connectivity, and infrastructure
- product-developer: For feature development, implementation, and testing
- ui-ux-specialist: For user interface design, user experience, and accessibility
- code-reviewer: For code quality, security, and best practices review
- general-purpose: For complex multi-step tasks requiring multiple capabilities

Always consider:
1. Problem complexity and scope
2. Required expertise domain
3. Whether human interaction is needed
4. Priority level (1-10, where 10 is critical)`,
      context: 'main',
      subagents: [
        'debug-engineer',
        'architect', 
        'document-writer',
        'network-engineer',
        'product-developer',
        'ui-ux-specialist',
        'code-reviewer',
        'general-purpose'
      ],
      triggers: [
        {
          condition: 'error OR bug OR failure OR crash',
          priority: 9,
          requiresHumanInteraction: false,
          targetAgent: 'debug-engineer',
          action: 'route_to_agent'
        },
        {
          condition: 'architecture OR design OR system OR structure',
          priority: 7,
          requiresHumanInteraction: true,
          targetAgent: 'architect',
          action: 'route_to_agent'
        },
        {
          condition: 'document OR documentation OR guide OR readme',
          priority: 5,
          requiresHumanInteraction: false,
          targetAgent: 'document-writer',
          action: 'route_to_agent'
        },
        {
          condition: 'network OR connectivity OR infrastructure OR deployment',
          priority: 8,
          requiresHumanInteraction: true,
          targetAgent: 'network-engineer',
          action: 'route_to_agent'
        },
        {
          condition: 'feature OR implement OR develop OR build',
          priority: 6,
          requiresHumanInteraction: false,
          targetAgent: 'product-developer',
          action: 'route_to_agent'
        },
        {
          condition: 'ui OR ux OR interface OR design OR user experience',
          priority: 7,
          requiresHumanInteraction: true,
          targetAgent: 'ui-ux-specialist',
          action: 'route_to_agent'
        }
      ]
    });

    // ATLAS Orchestrator Skill - Coordinates ATLAS process execution
    this.registerSkill({
      name: 'atlas-orchestrator',
      description: 'Orchestrates complex tasks through the ATLAS 5-step process',
      systemPrompt: `You are the ATLAS Orchestrator skill for AGI-MCP.

Your purpose:
- Break down complex tasks into ATLAS steps
- Coordinate execution across multiple subagents
- Ensure systematic progress through all phases
- Track and synthesize results

ATLAS Process:
1. Analyze - Understand the task thoroughly
2. Task Breakdown - Decompose into subtasks
3. Learn - Gather necessary knowledge and resources
4. Act - Execute the plan systematically
5. Synthesize - Integrate results and extract insights

Delegate steps to specialized agents when appropriate.
Maintain state across the entire process.`,
      context: 'main',
      subagents: ['general-purpose', 'explore'],
      model: 'sonnet'
    });

    // GOTCHA Coordinator Skill - Manages GOTCHA framework execution
    this.registerSkill({
      name: 'gotcha-coordinator',
      description: 'Coordinates goal pursuit through the GOTCHA cognitive framework',
      systemPrompt: `You are the GOTCHA Coordinator skill for AGI-MCP.

Your purpose:
- Guide goal-oriented task execution
- Ensure all GOTCHA layers are utilized
- Form and validate hypotheses
- Learn from assessments

GOTCHA Framework:
1. Goals - Define clear objectives
2. Observations - Gather environmental data
3. Thoughts - Process and reason about information
4. Commands - Execute actions
5. Hypotheses - Form predictions
6. Assessments - Evaluate performance and learn

Maintain cognitive coherence across all layers.
Use thinking mechanism to filter and validate decisions.`,
      context: 'main',
      model: 'sonnet'
    });

    // Code Quality Skill - Ensures code quality and best practices
    this.registerSkill({
      name: 'code-quality',
      description: 'Ensures code quality, security, and best practices',
      systemPrompt: `You are the Code Quality skill for AGI-MCP.

Your purpose:
- Review code for quality and security
- Enforce best practices and standards
- Identify potential issues and vulnerabilities
- Suggest improvements and optimizations

Focus areas:
- Code readability and maintainability
- Security vulnerabilities
- Performance optimization
- Error handling and edge cases
- Test coverage and quality
- Documentation completeness

Always provide specific, actionable feedback.`,
      context: 'fork',
      agentType: 'code-reviewer',
      model: 'sonnet',
      tools: ['get_memory', 'get_active_goals']
    });
  }

  /**
   * Load skills from a directory
   */
  private loadSkillsFromDirectory(directory: string, source: string): void {
    if (!existsSync(directory)) {
      return;
    }

    try {
      const files = readdirSync(directory).filter(f => f.endsWith('.md'));
      
      for (const file of files) {
        const filepath = join(directory, file);
        const content = readFileSync(filepath, 'utf-8');
        const skill = this.parseSkillFile(content, source);
        
        if (skill) {
          this.registerSkill(skill);
          console.log(`[Skills] Loaded ${source} skill: ${skill.name}`);
        }
      }
    } catch (error) {
      console.error(`[Skills] Error loading skills from ${directory}:`, error);
    }
  }

  /**
   * Parse skill markdown file with frontmatter
   */
  private parseSkillFile(content: string, source: string): SkillConfig | null {
    try {
      // Extract YAML frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]+?)\n---\n([\s\S]+)$/);
      
      if (!frontmatterMatch) {
        return null;
      }

      const [, frontmatter, systemPrompt] = frontmatterMatch;
      const config: any = {};

      // Simple YAML parsing (in production, use a proper YAML parser)
      frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim();
          
          // Handle arrays
          if (value.startsWith('[') && value.endsWith(']')) {
            config[key.trim()] = value.slice(1, -1).split(',').map(v => v.trim());
          } else {
            config[key.trim()] = value;
          }
        }
      });

      return {
        name: config.name,
        description: config.description,
        systemPrompt: systemPrompt.trim(),
        context: config.context || 'main',
        agentType: config.agentType,
        model: config.model || 'inherit',
        tools: config.tools,
        subagents: config.subagents,
        triggers: config.triggers,
        hooks: config.hooks,
        once: config.once === 'true'
      };
    } catch (error) {
      console.error('[Skills] Error parsing skill file:', error);
      return null;
    }
  }

  /**
   * Register a skill
   */
  registerSkill(skill: SkillConfig): void {
    this.skills.set(skill.name, skill);
  }

  /**
   * Execute a skill
   */
  async executeSkill(skillName: string, context: any = {}): Promise<any> {
    const skill = this.skills.get(skillName);
    
    if (!skill) {
      throw new Error(`Skill not found: ${skillName}`);
    }

    const executionId = `${skillName}-${Date.now()}`;
    const execution: SkillExecution = {
      skillName,
      startTime: new Date(),
      status: 'running'
    };

    this.executions.set(executionId, execution);

    try {
      console.log(`[Skills] Executing skill: ${skillName}`);

      // Check if skill should run in fork context (subagent)
      if (skill.context === 'fork' && skill.agentType) {
        // Execute in subagent - convert context to task description
        const taskDescription = typeof context === 'string' 
          ? context 
          : context.description || context.task || JSON.stringify(context);
        
        const result = await this.subagents.executeTask(skill.agentType, taskDescription);

        execution.status = 'completed';
        execution.endTime = new Date();
        execution.result = result;

        return result;
      }

      // Execute in main context
      const result = await this.executeInMainContext(skill, context);

      execution.status = 'completed';
      execution.endTime = new Date();
      execution.result = result;

      return result;
    } catch (error) {
      execution.status = 'failed';
      execution.endTime = new Date();
      execution.error = error instanceof Error ? error.message : String(error);
      
      console.error(`[Skills] Skill execution failed: ${skillName}`, error);
      throw error;
    }
  }

  /**
   * Execute skill in main context
   */
  private async executeInMainContext(skill: SkillConfig, context: any): Promise<any> {
    // If skill defines subagents, orchestrate them
    if (skill.subagents && skill.subagents.length > 0) {
      return await this.orchestrateSubagents(skill, context);
    }

    // Execute skill logic based on triggers
    if (skill.triggers && skill.triggers.length > 0) {
      return await this.processTriggers(skill, context);
    }

    // Default: return skill configuration for manual use
    return {
      skill: skill.name,
      prompt: skill.systemPrompt,
      tools: skill.tools,
      context
    };
  }

  /**
   * Orchestrate multiple subagents
   */
  private async orchestrateSubagents(skill: SkillConfig, context: any): Promise<any> {
    const results: any[] = [];
    const taskDescription = typeof context === 'string'
      ? context
      : context.description || context.task || JSON.stringify(context);

    for (const agentName of skill.subagents || []) {
      try {
        const result = await this.subagents.executeTask(
          agentName,
          `${skill.systemPrompt}\n\nTask: ${taskDescription}`
        );

        results.push({
          agent: agentName,
          result,
          success: true
        });
      } catch (error) {
        results.push({
          agent: agentName,
          error: error instanceof Error ? error.message : String(error),
          success: false
        });
      }
    }

    return {
      skill: skill.name,
      orchestration: results,
      summary: this.summarizeOrchestration(results)
    };
  }

  /**
   * Process skill triggers
   */
  private async processTriggers(skill: SkillConfig, context: any): Promise<any> {
    const taskDescription = context.description || context.task || '';
    const matchedTriggers: any[] = [];

    // Find matching triggers
    for (const trigger of skill.triggers || []) {
      if (this.matchesTriggerCondition(taskDescription, trigger.condition)) {
        matchedTriggers.push(trigger);
      }
    }

    if (matchedTriggers.length === 0) {
      return {
        skill: skill.name,
        message: 'No matching triggers found',
        task: taskDescription
      };
    }

    // Sort by priority (highest first)
    matchedTriggers.sort((a, b) => b.priority - a.priority);

    const bestTrigger = matchedTriggers[0];

    // Check if human interaction is required
    if (bestTrigger.requiresHumanInteraction) {
      return {
        skill: skill.name,
        trigger: bestTrigger,
        requiresHumanInteraction: true,
        message: `Task matches "${bestTrigger.condition}" trigger (priority ${bestTrigger.priority}). Human interaction recommended before proceeding.`,
        suggestedAgent: bestTrigger.targetAgent,
        allMatches: matchedTriggers
      };
    }

    // Execute trigger action
    if (bestTrigger.action === 'route_to_agent' && bestTrigger.targetAgent) {
      const result = await this.subagents.executeTask(
        bestTrigger.targetAgent,
        taskDescription
      );

      return {
        skill: skill.name,
        trigger: bestTrigger,
        agent: bestTrigger.targetAgent,
        result,
        priority: bestTrigger.priority
      };
    }

    return {
      skill: skill.name,
      trigger: bestTrigger,
      message: 'Trigger matched but no action taken',
      allMatches: matchedTriggers
    };
  }

  /**
   * Check if task matches trigger condition
   */
  private matchesTriggerCondition(task: string, condition: string): boolean {
    const taskLower = task.toLowerCase();
    const keywords = condition.toLowerCase().split(/\s+(?:or|and)\s+/i);

    // OR logic: match if any keyword is present
    if (condition.toLowerCase().includes(' or ')) {
      return keywords.some(keyword => taskLower.includes(keyword.trim()));
    }

    // AND logic: match if all keywords are present
    if (condition.toLowerCase().includes(' and ')) {
      return keywords.every(keyword => taskLower.includes(keyword.trim()));
    }

    // Single keyword
    return taskLower.includes(keywords[0].trim());
  }

  /**
   * Summarize orchestration results
   */
  private summarizeOrchestration(results: any[]): string {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;

    return `Orchestrated ${total} agent(s): ${successful} succeeded, ${failed} failed`;
  }

  /**
   * Get skill configuration
   */
  getSkill(name: string): SkillConfig | undefined {
    return this.skills.get(name);
  }

  /**
   * List all available skills
   */
  listSkills(): SkillConfig[] {
    return Array.from(this.skills.values());
  }

  /**
   * Get execution history
   */
  getExecutionHistory(skillName?: string): SkillExecution[] {
    const executions = Array.from(this.executions.values());
    
    if (skillName) {
      return executions.filter(e => e.skillName === skillName);
    }

    return executions;
  }
}

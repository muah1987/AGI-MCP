import { MemoryDatabase } from '../database/memory-db.js';
import { GOTCHAFramework } from '../gotcha/framework.js';
import { ATLASProcess, ATLASTask } from '../atlas/process.js';

/**
 * MCP Tools - Comprehensive toolset for AGI-like operations
 * These tools integrate GOTCHA Framework and ATLAS Process
 */

export class MCPTools {
  private db: MemoryDatabase;
  private gotcha: GOTCHAFramework;
  private atlas: ATLASProcess;

  constructor(db: MemoryDatabase, gotcha: GOTCHAFramework, atlas: ATLASProcess) {
    this.db = db;
    this.gotcha = gotcha;
    this.atlas = atlas;
  }

  // Memory tools
  getToolDefinitions() {
    return [
      {
        name: 'set_goal',
        description: 'Define a new goal for the AGI system to pursue',
        inputSchema: {
          type: 'object',
          properties: {
            goal: { type: 'string', description: 'The goal to achieve' },
            priority: { type: 'number', description: 'Priority level (1-10)', default: 5 }
          },
          required: ['goal']
        }
      },
      {
        name: 'observe',
        description: 'Record an observation about the environment or state',
        inputSchema: {
          type: 'object',
          properties: {
            observation: { type: 'string', description: 'The observation to record' },
            source: { type: 'string', description: 'Source of the observation' }
          },
          required: ['observation']
        }
      },
      {
        name: 'think',
        description: 'Record a thought or reasoning process',
        inputSchema: {
          type: 'object',
          properties: {
            thought: { type: 'string', description: 'The thought to record' },
            reasoning: { type: 'string', description: 'The reasoning behind the thought' }
          },
          required: ['thought']
        }
      },
      {
        name: 'execute_command',
        description: 'Execute a command and record it in memory',
        inputSchema: {
          type: 'object',
          properties: {
            command: { type: 'string', description: 'The command to execute' },
            parameters: { type: 'object', description: 'Command parameters' }
          },
          required: ['command']
        }
      },
      {
        name: 'form_hypothesis',
        description: 'Form a hypothesis about expected outcomes',
        inputSchema: {
          type: 'object',
          properties: {
            hypothesis: { type: 'string', description: 'The hypothesis to form' },
            prediction: { type: 'string', description: 'Predicted outcome' },
            confidence: { type: 'number', description: 'Confidence level (0-1)' }
          },
          required: ['hypothesis']
        }
      },
      {
        name: 'assess_performance',
        description: 'Assess performance and record learnings',
        inputSchema: {
          type: 'object',
          properties: {
            assessment: { type: 'string', description: 'The assessment to record' },
            score: { type: 'number', description: 'Performance score (0-1)' },
            learnings: { type: 'string', description: 'Key learnings from the assessment' }
          },
          required: ['assessment']
        }
      },
      {
        name: 'execute_atlas_task',
        description: 'Execute a task using the ATLAS 5-step process (Analyze, Task Breakdown, Learn, Act, Synthesize)',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string', description: 'Unique identifier for the task' },
            description: { type: 'string', description: 'Task description' },
            context: { type: 'object', description: 'Additional context for the task' }
          },
          required: ['task_id', 'description']
        }
      },
      {
        name: 'get_active_goals',
        description: 'Retrieve all active goals from memory',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      },
      {
        name: 'get_memory',
        description: 'Retrieve memory entries by layer (goals, observations, thoughts, commands, hypotheses, assessments)',
        inputSchema: {
          type: 'object',
          properties: {
            layer: { type: 'string', description: 'Memory layer to retrieve' },
            limit: { type: 'number', description: 'Maximum number of entries to return', default: 100 }
          },
          required: ['layer']
        }
      },
      {
        name: 'get_atlas_history',
        description: 'Retrieve ATLAS process history for a specific task',
        inputSchema: {
          type: 'object',
          properties: {
            task_id: { type: 'string', description: 'Task identifier' }
          },
          required: ['task_id']
        }
      },
      {
        name: 'process_goal_with_gotcha',
        description: 'Process a goal through all GOTCHA framework layers',
        inputSchema: {
          type: 'object',
          properties: {
            goal: { type: 'string', description: 'The goal to process' },
            priority: { type: 'number', description: 'Priority level (1-10)', default: 5 }
          },
          required: ['goal']
        }
      },
      {
        name: 'get_session_summary',
        description: 'Get a summary of the current session including all GOTCHA and ATLAS activities',
        inputSchema: {
          type: 'object',
          properties: {}
        }
      }
    ];
  }

  // Tool handlers
  async handleToolCall(name: string, args: any): Promise<any> {
    switch (name) {
      case 'set_goal':
        return this.handleSetGoal(args);
      case 'observe':
        return this.handleObserve(args);
      case 'think':
        return this.handleThink(args);
      case 'execute_command':
        return this.handleExecuteCommand(args);
      case 'form_hypothesis':
        return this.handleFormHypothesis(args);
      case 'assess_performance':
        return this.handleAssessPerformance(args);
      case 'execute_atlas_task':
        return this.handleExecuteATLASTask(args);
      case 'get_active_goals':
        return this.handleGetActiveGoals();
      case 'get_memory':
        return this.handleGetMemory(args);
      case 'get_atlas_history':
        return this.handleGetATLASHistory(args);
      case 'process_goal_with_gotcha':
        return this.handleProcessGoalWithGOTCHA(args);
      case 'get_session_summary':
        return this.handleGetSessionSummary();
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async handleSetGoal(args: any) {
    const id = this.gotcha.defineGoal(args.goal, args.priority || 5);
    return {
      success: true,
      goalId: id,
      message: `Goal set successfully: ${args.goal}`
    };
  }

  private async handleObserve(args: any) {
    const id = this.gotcha.observe(args.observation, args.source);
    return {
      success: true,
      observationId: id,
      message: `Observation recorded: ${args.observation}`
    };
  }

  private async handleThink(args: any) {
    const id = this.gotcha.think(args.thought, args.reasoning);
    return {
      success: true,
      thoughtId: id,
      message: `Thought recorded: ${args.thought}`
    };
  }

  private async handleExecuteCommand(args: any) {
    const id = this.gotcha.executeCommand(args.command, args.parameters);
    return {
      success: true,
      commandId: id,
      message: `Command executed: ${args.command}`
    };
  }

  private async handleFormHypothesis(args: any) {
    const id = this.gotcha.formHypothesis(args.hypothesis, args.prediction, args.confidence);
    return {
      success: true,
      hypothesisId: id,
      message: `Hypothesis formed: ${args.hypothesis}`
    };
  }

  private async handleAssessPerformance(args: any) {
    const id = this.gotcha.assess(args.assessment, args.score, args.learnings);
    return {
      success: true,
      assessmentId: id,
      message: `Assessment recorded: ${args.assessment}`
    };
  }

  private async handleExecuteATLASTask(args: any) {
    const task: ATLASTask = {
      id: args.task_id,
      description: args.description,
      context: args.context
    };
    const result = await this.atlas.executeTask(task);
    return {
      success: true,
      result: result,
      message: `ATLAS task completed: ${args.description}`
    };
  }

  private async handleGetActiveGoals() {
    const goals = this.gotcha.getActiveGoals();
    return {
      success: true,
      goals: goals,
      count: goals.length
    };
  }

  private async handleGetMemory(args: any) {
    const entries = this.db.getMemoryByLayer(args.layer, args.limit || 100);
    return {
      success: true,
      layer: args.layer,
      entries: entries,
      count: entries.length
    };
  }

  private async handleGetATLASHistory(args: any) {
    const steps = this.db.getATLASStepsByTask(args.task_id);
    return {
      success: true,
      taskId: args.task_id,
      steps: steps,
      count: steps.length
    };
  }

  private async handleProcessGoalWithGOTCHA(args: any) {
    const result = await this.gotcha.processGoal(args.goal, args.priority || 5);
    return {
      success: true,
      result: result,
      message: `Goal processed through GOTCHA framework: ${args.goal}`
    };
  }

  private async handleGetSessionSummary() {
    const allMemory = this.db.getAllMemory(1000);
    const goals = this.gotcha.getActiveGoals();
    
    return {
      success: true,
      summary: {
        totalMemoryEntries: allMemory.length,
        activeGoals: goals.length,
        memoryByLayer: {
          total: allMemory.length
        },
        timestamp: new Date().toISOString()
      }
    };
  }
}

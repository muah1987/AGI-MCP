#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';

import { MemoryDatabase } from './database/memory-db.js';
import { MemoryInfrastructure } from './database/infrastructure.js';
import { GOTCHAFramework } from './gotcha/framework.js';
import { ThinkingMechanism } from './gotcha/thinking.js';
import { ATLASProcess } from './atlas/process.js';
import { MCPTools } from './tools/mcp-tools.js';
import { SubagentSystem } from './subagents/subagent-system.js';
import { SkillSystem } from './skills/skill-system.js';
import { HookSystem } from './hooks/hook-system.js';

/**
 * AGI-MCP Server
 * 
 * A comprehensive MCP server implementing:
 * - GOTCHA Framework (6-layer cognitive architecture)
 * - ATLAS Process (5-step systematic execution)
 * - Thinking Mechanism (intelligent reasoning and filtering)
 * - Hook System (11 lifecycle events with customization)
 * - Subagent System (specialized AI assistants)
 * - Skill System (orchestration and automation)
 * - Database integration (SQLite as source of truth)
 * - Memory infrastructure management
 */

class AGIMCPServer {
  private server: Server;
  private db: MemoryDatabase;
  private gotcha: GOTCHAFramework;
  private thinking: ThinkingMechanism;
  private atlas: ATLASProcess;
  private subagents: SubagentSystem;
  private skills: SkillSystem;
  private hooks: HookSystem;
  private tools: MCPTools;
  private infrastructure: MemoryInfrastructure;
  private sessionId: number | null = null;

  constructor() {
    // Initialize memory infrastructure first
    this.infrastructure = new MemoryInfrastructure();
    this.infrastructure.ensureInfrastructure();

    // Initialize database
    this.db = new MemoryDatabase();

    // Initialize GOTCHA Framework
    this.gotcha = new GOTCHAFramework(this.db);

    // Initialize Thinking Mechanism
    this.thinking = new ThinkingMechanism(
      this.db,
      this.gotcha,
      {
        purpose: 'AGI-MCP Server providing comprehensive AGI-like capabilities through MCP interface',
        constraints: ['Maintain data integrity', 'Ensure security', 'Provide accurate information'],
        priorities: ['User satisfaction', 'Task completion', 'System reliability'],
        currentGoals: [],
        recentObservations: []
      }
    );

    // Initialize ATLAS Process
    this.atlas = new ATLASProcess(this.db, this.gotcha);

    // Initialize Subagent System
    this.subagents = new SubagentSystem(this.db, process.cwd());
    this.subagents.loadSubagents();

    // Initialize Skill System
    this.skills = new SkillSystem(this.db, this.subagents, this.thinking, process.cwd());
    this.skills.loadSkills();

    // Initialize Hook System (with empty config for now - can be configured via .agi-mcp/hooks.json)
    this.hooks = new HookSystem({}, String(Date.now()), process.cwd());

    // Initialize MCP Tools
    this.tools = new MCPTools(this.db, this.gotcha, this.atlas, this.skills, this.subagents);

    // Initialize MCP Server
    this.server = new Server(
      {
        name: 'agi-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.startSession();
  }

  private async startSession(): Promise<void> {
    this.sessionId = this.db.startSession();
    console.log(`[AGI-MCP] Session started: ${this.sessionId}`);
    
    // Log session start in GOTCHA framework
    this.gotcha.observe('AGI-MCP Server session started', 'system');
    this.gotcha.defineGoal('Provide AGI-like capabilities through MCP interface', 10);
    
    console.log('[AGI-MCP] All systems initialized:');
    console.log(`  - GOTCHA Framework: ✓`);
    console.log(`  - ATLAS Process: ✓`);
    console.log(`  - Thinking Mechanism: ✓`);
    console.log(`  - Subagent System: ${this.subagents.listSubagents().length} agents loaded`);
    console.log(`  - Skill System: ${this.skills.listSkills().length} skills loaded`);
    console.log(`  - Hook System: ✓`);
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolDefinitions = this.tools.getToolDefinitions();
      return {
        tools: toolDefinitions as Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const result = await this.tools.handleToolCall(
          request.params.name,
          request.params.arguments || {}
        );

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: errorMessage,
              }, null, 2),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);

    console.log('[AGI-MCP] Server running on stdio');
    console.log('[AGI-MCP] GOTCHA Framework: Active');
    console.log('[AGI-MCP] ATLAS Process: Ready');
    console.log('[AGI-MCP] Database: Connected');
    
    // Log infrastructure status
    const status = this.infrastructure.getStatus();
    console.log('[AGI-MCP] Infrastructure Status:', JSON.stringify(status, null, 2));
  }

  async shutdown(): Promise<void> {
    if (this.sessionId !== null) {
      this.db.endSession(this.sessionId, 'Session completed successfully');
      console.log(`[AGI-MCP] Session ended: ${this.sessionId}`);
    }
    this.db.close();
  }
}

// Main execution
const server = new AGIMCPServer();

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[AGI-MCP] Shutting down gracefully...');
  await server.shutdown();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[AGI-MCP] Shutting down gracefully...');
  await server.shutdown();
  process.exit(0);
});

// Start the server
server.run().catch((error) => {
  console.error('[AGI-MCP] Fatal error:', error);
  process.exit(1);
});

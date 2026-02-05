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
import { ATLASProcess } from './atlas/process.js';
import { MCPTools } from './tools/mcp-tools.js';

/**
 * AGI-MCP Server
 * 
 * A comprehensive MCP server implementing:
 * - GOTCHA Framework (6-layer architecture for agentic systems)
 * - ATLAS Process (5-step process for task execution)
 * - Database integration (SQLite as source of truth)
 * - Memory infrastructure management
 */

class AGIMCPServer {
  private server: Server;
  private db: MemoryDatabase;
  private gotcha: GOTCHAFramework;
  private atlas: ATLASProcess;
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

    // Initialize ATLAS Process
    this.atlas = new ATLASProcess(this.db, this.gotcha);

    // Initialize MCP Tools
    this.tools = new MCPTools(this.db, this.gotcha, this.atlas);

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

  private startSession(): void {
    this.sessionId = this.db.startSession();
    console.log(`[AGI-MCP] Session started: ${this.sessionId}`);
    
    // Log session start in GOTCHA framework
    this.gotcha.observe('AGI-MCP Server session started', 'system');
    this.gotcha.defineGoal('Provide AGI-like capabilities through MCP interface', 10);
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

import { exec } from 'child_process';
import { promisify } from 'util';
import { ThinkingMechanism, ThinkingResult } from '../gotcha/thinking.js';

const execAsync = promisify(exec);

/**
 * Hook System for AGI-MCP Server
 * Implements Claude Code-style hooks for lifecycle events
 */

export type HookEvent = 
  | 'SessionStart'
  | 'UserPromptSubmit'
  | 'PreToolUse'
  | 'PermissionRequest'
  | 'PostToolUse'
  | 'Stop'
  | 'SubagentStart'
  | 'SubagentStop'
  | 'PreCompact'
  | 'Setup'
  | 'SessionEnd'
  | 'Notification';

export type HookType = 'command' | 'prompt';

export interface Hook {
  type: HookType;
  command?: string;
  prompt?: string;
  timeout?: number;
}

export interface HookMatcher {
  matcher?: string;
  hooks: Hook[];
}

export interface HookConfig {
  [event: string]: HookMatcher[];
}

export interface HookInput {
  session_id: string;
  transcript_path?: string;
  cwd: string;
  permission_mode: string;
  hook_event_name: HookEvent;
  [key: string]: any;
}

export interface HookOutput {
  continue?: boolean;
  stopReason?: string;
  suppressOutput?: boolean;
  systemMessage?: string;
  decision?: 'allow' | 'deny' | 'ask' | 'block' | 'approve';
  reason?: string;
  hookSpecificOutput?: any;
  updatedInput?: any;
  additionalContext?: string;
}

export class HookSystem {
  private config: HookConfig;
  private thinking?: ThinkingMechanism;
  private sessionId: string;
  private cwd: string;
  private permissionMode: string = 'default';

  constructor(config: HookConfig, sessionId: string, cwd: string) {
    this.config = config;
    this.sessionId = sessionId;
    this.cwd = cwd;
  }

  setThinkingMechanism(thinking: ThinkingMechanism): void {
    this.thinking = thinking;
  }

  /**
   * Execute hooks for a specific event
   */
  async executeHooks(event: HookEvent, input: Partial<HookInput>): Promise<HookOutput[]> {
    const matchers = this.config[event] || [];
    const results: HookOutput[] = [];

    console.log(`[Hooks] Executing ${matchers.length} matcher(s) for ${event}`);

    for (const matcher of matchers) {
      // Check if matcher applies
      if (matcher.matcher && !this.matchesTool(matcher.matcher, input)) {
        continue;
      }

      // Execute all hooks for this matcher in parallel
      const hookPromises = matcher.hooks.map(hook => 
        this.executeHook(event, hook, input).catch(error => {
          console.error(`[Hooks] Error executing hook:`, error);
          return null;
        })
      );

      const hookResults = await Promise.all(hookPromises);
      results.push(...hookResults.filter((r): r is HookOutput => r !== null));
    }

    return results;
  }

  /**
   * Execute a single hook
   */
  private async executeHook(
    event: HookEvent,
    hook: Hook,
    input: Partial<HookInput>
  ): Promise<HookOutput | null> {
    const fullInput: HookInput = {
      session_id: this.sessionId,
      cwd: this.cwd,
      permission_mode: this.permissionMode,
      hook_event_name: event,
      ...input
    };

    if (hook.type === 'command') {
      return await this.executeCommandHook(hook, fullInput);
    } else if (hook.type === 'prompt') {
      return await this.executePromptHook(hook, fullInput);
    }

    return null;
  }

  /**
   * Execute a command-based hook
   */
  private async executeCommandHook(hook: Hook, input: HookInput): Promise<HookOutput | null> {
    if (!hook.command) return null;

    const timeout = hook.timeout || 60000;
    const inputJson = JSON.stringify(input);

    try {
      const { stdout, stderr } = await execAsync(hook.command, {
        timeout,
        env: {
          ...process.env,
          AGI_MCP_PROJECT_DIR: this.cwd
        }
      });

      // Try to parse JSON output
      if (stdout.trim()) {
        try {
          const output = JSON.parse(stdout.trim());
          return output as HookOutput;
        } catch {
          // Not JSON, treat as plain text output
          return {
            additionalContext: stdout.trim()
          };
        }
      }

      return { continue: true };
    } catch (error: any) {
      // Exit code 2 = blocking error
      if (error.code === 2) {
        return {
          decision: 'block',
          reason: error.stderr || 'Hook blocked action',
          continue: false
        };
      }

      // Other errors are non-blocking
      console.warn(`[Hooks] Non-blocking error in hook:`, error.stderr || error.message);
      return { continue: true };
    }
  }

  /**
   * Execute a prompt-based hook (uses thinking mechanism)
   */
  private async executePromptHook(hook: Hook, input: HookInput): Promise<HookOutput | null> {
    if (!hook.prompt || !this.thinking) return null;

    // Replace $ARGUMENTS placeholder
    const prompt = hook.prompt.replace('$ARGUMENTS', JSON.stringify(input, null, 2));

    console.log(`[Hooks] Executing prompt-based hook with thinking mechanism`);

    // Use thinking mechanism to evaluate
    let thinkingResult: ThinkingResult;

    try {
      // Determine which evaluation method to use based on event
      if (input.hook_event_name === 'UserPromptSubmit') {
        thinkingResult = await this.thinking.evaluatePrompt(input.prompt || '');
      } else if (input.hook_event_name === 'PreToolUse') {
        thinkingResult = await this.thinking.evaluateToolUse(
          input.tool_name || '',
          input.tool_input || {}
        );
      } else if (input.hook_event_name === 'Stop' || input.hook_event_name === 'SubagentStop') {
        thinkingResult = await this.thinking.evaluateCompletion(input);
      } else {
        // Default evaluation
        thinkingResult = {
          shouldProceed: true,
          confidence: 0.8,
          reasoning: 'Default evaluation passed'
        };
      }

      return {
        continue: thinkingResult.shouldProceed,
        decision: thinkingResult.shouldProceed ? 'allow' : 'block',
        reason: thinkingResult.reasoning,
        additionalContext: thinkingResult.reasoning,
        hookSpecificOutput: {
          confidence: thinkingResult.confidence,
          warnings: thinkingResult.warnings,
          modifications: thinkingResult.modifications
        }
      };
    } catch (error) {
      console.error(`[Hooks] Error in prompt-based hook:`, error);
      return { continue: true }; // Allow on error
    }
  }

  /**
   * Check if a matcher matches the current tool
   */
  private matchesTool(matcher: string, input: Partial<HookInput>): boolean {
    if (!matcher || matcher === '*' || matcher === '') return true;

    const toolName = input.tool_name || input.agent_type || '';
    
    // Exact match
    if (matcher === toolName) return true;

    // Regex match
    try {
      const regex = new RegExp(matcher);
      return regex.test(toolName);
    } catch {
      return false;
    }
  }

  /**
   * Handle SessionStart hook
   */
  async onSessionStart(source: 'startup' | 'resume' | 'clear' | 'compact'): Promise<string[]> {
    const results = await this.executeHooks('SessionStart', {
      source,
      model: 'agi-mcp-server-1.0'
    });

    const contextAdditions: string[] = [];
    for (const result of results) {
      if (result.additionalContext) {
        contextAdditions.push(result.additionalContext);
      }
      if (result.hookSpecificOutput?.additionalContext) {
        contextAdditions.push(result.hookSpecificOutput.additionalContext);
      }
    }

    return contextAdditions;
  }

  /**
   * Handle UserPromptSubmit hook
   */
  async onUserPromptSubmit(prompt: string): Promise<{ allowed: boolean; context?: string; reason?: string }> {
    const results = await this.executeHooks('UserPromptSubmit', { prompt });

    let allowed = true;
    let context = '';
    let reason = '';

    for (const result of results) {
      if (result.decision === 'block' || result.continue === false) {
        allowed = false;
        reason = result.reason || result.stopReason || 'Prompt blocked by hook';
        break;
      }
      if (result.additionalContext) {
        context += result.additionalContext + '\n';
      }
    }

    return { allowed, context: context.trim(), reason };
  }

  /**
   * Handle PreToolUse hook
   */
  async onPreToolUse(toolName: string, toolInput: any, toolUseId: string): Promise<{
    allowed: boolean;
    reason?: string;
    updatedInput?: any;
    additionalContext?: string;
  }> {
    const results = await this.executeHooks('PreToolUse', {
      tool_name: toolName,
      tool_input: toolInput,
      tool_use_id: toolUseId
    });

    let allowed = true;
    let reason = '';
    let updatedInput = toolInput;
    let additionalContext = '';

    for (const result of results) {
      // Check permission decision
      if (result.decision === 'deny' || result.decision === 'block') {
        allowed = false;
        reason = result.reason || 'Tool use blocked by hook';
        break;
      }

      if (result.decision === 'allow' || result.decision === 'approve') {
        allowed = true;
      }

      // Apply input modifications
      if (result.updatedInput) {
        updatedInput = { ...updatedInput, ...result.updatedInput };
      }

      // Collect additional context
      if (result.additionalContext) {
        additionalContext += result.additionalContext + '\n';
      }
      if (result.hookSpecificOutput?.additionalContext) {
        additionalContext += result.hookSpecificOutput.additionalContext + '\n';
      }
    }

    return {
      allowed,
      reason,
      updatedInput,
      additionalContext: additionalContext.trim()
    };
  }

  /**
   * Handle PostToolUse hook
   */
  async onPostToolUse(
    toolName: string,
    toolInput: any,
    toolResponse: any,
    toolUseId: string
  ): Promise<{ blocked: boolean; reason?: string; additionalContext?: string }> {
    const results = await this.executeHooks('PostToolUse', {
      tool_name: toolName,
      tool_input: toolInput,
      tool_response: toolResponse,
      tool_use_id: toolUseId
    });

    let blocked = false;
    let reason = '';
    let additionalContext = '';

    for (const result of results) {
      if (result.decision === 'block') {
        blocked = true;
        reason = result.reason || 'Post-tool action blocked';
      }

      if (result.additionalContext) {
        additionalContext += result.additionalContext + '\n';
      }
      if (result.hookSpecificOutput?.additionalContext) {
        additionalContext += result.hookSpecificOutput.additionalContext + '\n';
      }
    }

    return { blocked, reason, additionalContext: additionalContext.trim() };
  }

  /**
   * Handle Stop hook
   */
  async onStop(stopHookActive: boolean = false): Promise<{ shouldContinue: boolean; reason?: string }> {
    const results = await this.executeHooks('Stop', { stop_hook_active: stopHookActive });

    let shouldContinue = false;
    let reason = '';

    for (const result of results) {
      if (result.decision === 'block' || result.continue === false) {
        shouldContinue = true; // Block stopping = continue working
        reason = result.reason || 'Work not yet complete';
        break;
      }
    }

    return { shouldContinue, reason };
  }

  /**
   * Handle SubagentStart hook
   */
  async onSubagentStart(agentId: string, agentType: string): Promise<void> {
    await this.executeHooks('SubagentStart', {
      agent_id: agentId,
      agent_type: agentType
    });
  }

  /**
   * Handle SubagentStop hook
   */
  async onSubagentStop(agentId: string, agentType: string, stopHookActive: boolean = false): Promise<{ shouldContinue: boolean; reason?: string }> {
    const results = await this.executeHooks('SubagentStop', {
      agent_id: agentId,
      agent_type: agentType,
      stop_hook_active: stopHookActive
    });

    let shouldContinue = false;
    let reason = '';

    for (const result of results) {
      if (result.decision === 'block' || result.continue === false) {
        shouldContinue = true;
        reason = result.reason || 'Subagent work not yet complete';
        break;
      }
    }

    return { shouldContinue, reason };
  }

  /**
   * Handle SessionEnd hook
   */
  async onSessionEnd(reason: 'clear' | 'logout' | 'exit' | 'other'): Promise<void> {
    await this.executeHooks('SessionEnd', { reason });
  }

  /**
   * Handle Notification hook
   */
  async onNotification(message: string, notificationType: string): Promise<void> {
    await this.executeHooks('Notification', {
      message,
      notification_type: notificationType
    });
  }
}

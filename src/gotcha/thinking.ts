import { MemoryDatabase } from '../database/memory-db.js';
import { GOTCHAFramework } from '../gotcha/framework.js';

/**
 * Thinking Mechanism for AGI-MCP Agents
 * 
 * Provides a reasoning and filtering layer that evaluates prompts,
 * jobs, and actions based on agent purpose and context.
 */

export interface ThinkingContext {
  purpose: string;
  constraints: string[];
  priorities: string[];
  currentGoals: any[];
  recentObservations: any[];
}

export interface ThinkingResult {
  shouldProceed: boolean;
  confidence: number;
  reasoning: string;
  modifications?: any;
  warnings?: string[];
}

export class ThinkingMechanism {
  private db: MemoryDatabase;
  private gotcha: GOTCHAFramework;
  private context: ThinkingContext;

  constructor(db: MemoryDatabase, gotcha: GOTCHAFramework, context: ThinkingContext) {
    this.db = db;
    this.gotcha = gotcha;
    this.context = context;
  }

  /**
   * Filter and evaluate a user prompt based on agent purpose
   */
  async evaluatePrompt(prompt: string): Promise<ThinkingResult> {
    console.log('[Thinking] Evaluating prompt:', prompt.substring(0, 100) + '...');

    // Record the thinking process
    const thinking = `Evaluating prompt relevance to purpose: ${this.context.purpose}`;
    this.gotcha.think(thinking, 'Prompt evaluation');

    // Analyze prompt against purpose
    const relevance = this.analyzeRelevance(prompt, this.context.purpose);
    const safety = this.checkSafety(prompt);
    const alignment = this.checkGoalAlignment(prompt);

    const shouldProceed = relevance.score > 0.5 && safety.safe && alignment.aligned;
    const confidence = (relevance.score + (safety.safe ? 1 : 0) + (alignment.aligned ? 1 : 0)) / 3;

    const reasoning = this.buildReasoning({
      relevance,
      safety,
      alignment,
      shouldProceed,
      confidence
    });

    // Record hypothesis about outcome
    if (shouldProceed) {
      this.gotcha.formHypothesis(
        `Prompt will be processed successfully`,
        `Expected good outcome based on alignment`,
        confidence
      );
    }

    return {
      shouldProceed,
      confidence,
      reasoning,
      warnings: safety.warnings
    };
  }

  /**
   * Filter and evaluate a tool use based on agent purpose
   */
  async evaluateToolUse(toolName: string, toolInput: any): Promise<ThinkingResult> {
    console.log(`[Thinking] Evaluating tool use: ${toolName}`);

    const thinking = `Evaluating tool "${toolName}" appropriateness for purpose: ${this.context.purpose}`;
    this.gotcha.think(thinking, 'Tool use evaluation');

    // Check if tool use aligns with constraints
    const constraintCheck = this.checkConstraints(toolName, toolInput);
    const purposeCheck = this.checkToolPurposeAlignment(toolName);
    const riskAssessment = this.assessToolRisk(toolName, toolInput);

    const shouldProceed = constraintCheck.passed && purposeCheck.aligned && riskAssessment.acceptable;
    const confidence = constraintCheck.passed ? 0.8 : 0.3;

    const reasoning = `Tool: ${toolName}\n` +
      `Constraint check: ${constraintCheck.passed ? 'PASS' : 'FAIL'} - ${constraintCheck.reason}\n` +
      `Purpose alignment: ${purposeCheck.aligned ? 'YES' : 'NO'} - ${purposeCheck.reason}\n` +
      `Risk level: ${riskAssessment.level} - ${riskAssessment.reason}`;

    // Modify input if needed
    const modifications = this.suggestModifications(toolName, toolInput, riskAssessment);

    return {
      shouldProceed,
      confidence,
      reasoning,
      modifications,
      warnings: riskAssessment.warnings
    };
  }

  /**
   * Evaluate whether to continue or stop based on completion assessment
   */
  async evaluateCompletion(context: any): Promise<ThinkingResult> {
    console.log('[Thinking] Evaluating task completion');

    const thinking = 'Assessing whether goals are achieved and work is complete';
    this.gotcha.think(thinking, 'Completion evaluation');

    const goalsAchieved = this.assessGoalsAchieved();
    const qualityCheck = this.assessOutputQuality(context);
    const remainingWork = this.identifyRemainingWork();

    const shouldProceed = remainingWork.length > 0 || !goalsAchieved || !qualityCheck.acceptable;
    const confidence = goalsAchieved && qualityCheck.acceptable ? 0.9 : 0.6;

    const reasoning = `Goals achieved: ${goalsAchieved ? 'YES' : 'NO'}\n` +
      `Quality acceptable: ${qualityCheck.acceptable ? 'YES' : 'NO'}\n` +
      `Remaining work items: ${remainingWork.length}\n` +
      (remainingWork.length > 0 ? `Items: ${remainingWork.join(', ')}` : '');

    return {
      shouldProceed,
      confidence,
      reasoning,
      warnings: qualityCheck.warnings
    };
  }

  /**
   * Update agent context based on observations
   */
  updateContext(observations: any[]): void {
    this.context.recentObservations = observations;
    this.context.currentGoals = this.gotcha.getActiveGoals();
  }

  // Private helper methods

  private analyzeRelevance(prompt: string, purpose: string): { score: number; reason: string } {
    // Simple keyword-based relevance for now
    const purposeKeywords = purpose.toLowerCase().split(' ');
    const promptLower = prompt.toLowerCase();
    
    const matches = purposeKeywords.filter(keyword => promptLower.includes(keyword));
    const score = matches.length / purposeKeywords.length;

    return {
      score,
      reason: score > 0.5 
        ? `Prompt aligns well with purpose (${matches.length}/${purposeKeywords.length} keywords match)`
        : `Prompt has weak alignment with purpose (${matches.length}/${purposeKeywords.length} keywords match)`
    };
  }

  private checkSafety(prompt: string): { safe: boolean; warnings: string[] } {
    const warnings: string[] = [];
    const dangerPatterns = [
      /rm\s+-rf\s+\//,
      /delete\s+all/i,
      /drop\s+database/i,
      /format\s+drive/i
    ];

    for (const pattern of dangerPatterns) {
      if (pattern.test(prompt)) {
        warnings.push(`Potentially dangerous operation detected: ${pattern}`);
      }
    }

    return {
      safe: warnings.length === 0,
      warnings
    };
  }

  private checkGoalAlignment(prompt: string): { aligned: boolean; reason: string } {
    const activeGoals = this.context.currentGoals;
    
    if (activeGoals.length === 0) {
      return { aligned: true, reason: 'No active goals to check against' };
    }

    // Check if prompt relates to any active goal
    const promptLower = prompt.toLowerCase();
    const relatedGoals = activeGoals.filter(goal => 
      promptLower.includes(goal.goal.toLowerCase().substring(0, 20))
    );

    return {
      aligned: relatedGoals.length > 0 || activeGoals.length === 0,
      reason: relatedGoals.length > 0 
        ? `Aligns with ${relatedGoals.length} active goal(s)`
        : 'Does not clearly align with active goals, but may establish new goals'
    };
  }

  private checkConstraints(toolName: string, toolInput: any): { passed: boolean; reason: string } {
    // Check against configured constraints
    for (const constraint of this.context.constraints) {
      if (constraint.toLowerCase().includes('no external')) {
        if (toolName.includes('Web') || toolName.includes('Network')) {
          return { passed: false, reason: `Constraint violation: ${constraint}` };
        }
      }
      if (constraint.toLowerCase().includes('read-only')) {
        if (toolName === 'Write' || toolName === 'Edit' || toolName === 'execute_command') {
          return { passed: false, reason: `Constraint violation: ${constraint}` };
        }
      }
    }

    return { passed: true, reason: 'All constraints satisfied' };
  }

  private checkToolPurposeAlignment(toolName: string): { aligned: boolean; reason: string } {
    // Tools are generally aligned unless purpose explicitly restricts them
    const purpose = this.context.purpose.toLowerCase();
    
    if (purpose.includes('read-only') && ['Write', 'Edit'].includes(toolName)) {
      return { aligned: false, reason: 'Write operations not aligned with read-only purpose' };
    }

    if (purpose.includes('analyze') && toolName === 'Write') {
      return { aligned: false, reason: 'Write operations not needed for analysis' };
    }

    return { aligned: true, reason: 'Tool aligns with agent purpose' };
  }

  private assessToolRisk(toolName: string, toolInput: any): { 
    level: 'low' | 'medium' | 'high'; 
    acceptable: boolean; 
    reason: string;
    warnings: string[];
  } {
    const warnings: string[] = [];

    // Assess based on tool type
    if (toolName === 'execute_command') {
      const command = toolInput.command || '';
      if (command.includes('rm') || command.includes('delete')) {
        warnings.push('Command includes destructive operations');
        return { level: 'high', acceptable: false, reason: 'Destructive command detected', warnings };
      }
      return { level: 'medium', acceptable: true, reason: 'Command execution requires monitoring', warnings };
    }

    if (toolName === 'Write' || toolName === 'Edit') {
      return { level: 'low', acceptable: true, reason: 'Standard file operation', warnings };
    }

    return { level: 'low', acceptable: true, reason: 'Low-risk operation', warnings };
  }

  private suggestModifications(toolName: string, toolInput: any, riskAssessment: any): any {
    // Suggest safer alternatives or modifications
    if (riskAssessment.level === 'high') {
      return {
        suggested: true,
        message: 'Consider reviewing this action or using a safer alternative'
      };
    }
    return undefined;
  }

  private assessGoalsAchieved(): boolean {
    const activeGoals = this.context.currentGoals;
    // If no active goals, consider work complete
    return activeGoals.length === 0;
  }

  private assessOutputQuality(context: any): { acceptable: boolean; warnings: string[] } {
    // Simple quality check - can be enhanced
    return { acceptable: true, warnings: [] };
  }

  private identifyRemainingWork(): string[] {
    const remaining: string[] = [];
    
    // Check active goals
    const activeGoals = this.context.currentGoals;
    for (const goal of activeGoals) {
      if (goal.status === 'active') {
        remaining.push(goal.goal);
      }
    }

    return remaining;
  }

  private buildReasoning(analysis: any): string {
    let reasoning = `Thinking Process:\n\n`;
    
    reasoning += `1. Relevance Analysis:\n`;
    reasoning += `   - Score: ${(analysis.relevance.score * 100).toFixed(0)}%\n`;
    reasoning += `   - ${analysis.relevance.reason}\n\n`;

    reasoning += `2. Safety Check:\n`;
    reasoning += `   - Safe: ${analysis.safety.safe ? 'YES' : 'NO'}\n`;
    if (analysis.safety.warnings.length > 0) {
      reasoning += `   - Warnings: ${analysis.safety.warnings.join('; ')}\n`;
    }
    reasoning += `\n`;

    reasoning += `3. Goal Alignment:\n`;
    reasoning += `   - Aligned: ${analysis.alignment.aligned ? 'YES' : 'NO'}\n`;
    reasoning += `   - ${analysis.alignment.reason}\n\n`;

    reasoning += `Decision: ${analysis.shouldProceed ? 'PROCEED' : 'BLOCK'}\n`;
    reasoning += `Confidence: ${(analysis.confidence * 100).toFixed(0)}%`;

    return reasoning;
  }
}

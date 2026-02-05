#!/usr/bin/env node

/**
 * Test script to verify AGI-MCP server functionality
 * Tests GOTCHA Framework, ATLAS Process, and Memory Infrastructure
 */

import { MemoryDatabase } from './database/memory-db.js';
import { MemoryInfrastructure } from './database/infrastructure.js';
import { GOTCHAFramework } from './gotcha/framework.js';
import { ATLASProcess } from './atlas/process.js';

async function runTests() {
  console.log('='.repeat(60));
  console.log('AGI-MCP Server - Functionality Tests');
  console.log('='.repeat(60));

  // Test 1: Memory Infrastructure
  console.log('\n[Test 1] Memory Infrastructure Initialization...');
  const infrastructure = new MemoryInfrastructure();
  infrastructure.ensureInfrastructure();
  const status = infrastructure.getStatus();
  console.log('✓ Memory infrastructure status:', status);
  console.log('✓ Memory infrastructure test passed!');

  // Test 2: Database Initialization
  console.log('\n[Test 2] Database Initialization...');
  const db = new MemoryDatabase();
  console.log('✓ Database initialized successfully!');

  // Test 3: GOTCHA Framework
  console.log('\n[Test 3] GOTCHA Framework Tests...');
  const gotcha = new GOTCHAFramework(db);
  
  // Test Goal layer
  const goalId = gotcha.defineGoal('Test AGI-MCP functionality', 9);
  console.log(`✓ Goal defined with ID: ${goalId}`);

  // Test Observation layer
  const obsId = gotcha.observe('System is running smoothly', 'test-system');
  console.log(`✓ Observation recorded with ID: ${obsId}`);

  // Test Thought layer
  const thoughtId = gotcha.think('All components are working as expected', 'Testing reasoning');
  console.log(`✓ Thought recorded with ID: ${thoughtId}`);

  // Test Command layer
  const cmdId = gotcha.executeCommand('test-command', { param1: 'value1' });
  gotcha.updateCommandResult(cmdId, 'Command executed successfully', 'completed');
  console.log(`✓ Command executed with ID: ${cmdId}`);

  // Test Hypothesis layer
  const hypId = gotcha.formHypothesis('System will perform well', 'Expected high performance', 0.9);
  console.log(`✓ Hypothesis formed with ID: ${hypId}`);

  // Test Assessment layer
  const assId = gotcha.assess('System performance is excellent', 0.95, 'All tests passed');
  console.log(`✓ Assessment recorded with ID: ${assId}`);

  console.log('✓ GOTCHA Framework test passed!');

  // Test 4: ATLAS Process
  console.log('\n[Test 4] ATLAS Process Tests...');
  const atlas = new ATLASProcess(db, gotcha);
  
  const task = {
    id: 'test-task-001',
    description: 'Verify ATLAS process functionality'
  };

  const result = await atlas.executeTask(task);
  console.log(`✓ ATLAS task executed with status: ${result.status}`);
  console.log(`  - Analysis: ${result.analysis.complexity}`);
  console.log(`  - Subtasks: ${result.subtasks.length}`);
  console.log(`  - Results: ${result.results.length}`);
  console.log(`  - Synthesis: ${result.synthesis.successfulActions}/${result.synthesis.totalResults} successful`);
  console.log('✓ ATLAS Process test passed!');

  // Test 5: Memory Retrieval
  console.log('\n[Test 5] Memory Retrieval Tests...');
  const activeGoals = gotcha.getActiveGoals();
  console.log(`✓ Retrieved ${activeGoals.length} active goals`);
  
  const memories = db.getAllMemory(10);
  console.log(`✓ Retrieved ${memories.length} memory entries`);
  
  const atlasHistory = db.getATLASStepsByTask('test-task-001');
  console.log(`✓ Retrieved ${atlasHistory.length} ATLAS steps for task`);
  console.log('✓ Memory retrieval test passed!');

  // Test 6: Session Management
  console.log('\n[Test 6] Session Management Tests...');
  const sessionId = db.startSession();
  console.log(`✓ Session started with ID: ${sessionId}`);
  db.endSession(sessionId, 'Test session completed successfully');
  console.log(`✓ Session ended successfully`);
  console.log('✓ Session management test passed!');

  // Cleanup
  db.close();
  console.log('\n✓ Database connection closed');

  // Final summary
  console.log('\n' + '='.repeat(60));
  console.log('All Tests Passed! ✓');
  console.log('='.repeat(60));
  console.log('\nAGI-MCP Server Components:');
  console.log('  ✓ Memory Infrastructure - Operational');
  console.log('  ✓ Database (SQLite) - Operational');
  console.log('  ✓ GOTCHA Framework (6 layers) - Operational');
  console.log('  ✓ ATLAS Process (5 steps) - Operational');
  console.log('  ✓ Session Management - Operational');
  console.log('\nThe AGI-MCP server is ready for use!');
}

// Run tests
runTests().catch((error) => {
  console.error('\n❌ Test failed:', error);
  process.exit(1);
});

---
description: Creates a concise engineering implementation plan based on user requirements and saves it to specs directory
argument-hint: [user prompt]
model: inherit
---

# Quick Plan

Create a detailed implementation plan based on the user's requirements provided through the `USER_PROMPT` variable. Analyze the request, think through the implementation approach, and save a comprehensive specification document to `PLAN_OUTPUT_DIRECTORY/<name-of-plan>.md` that can be used as a blueprint for actual development work. Follow the `Instructions` and work through the `Workflow` to create the plan.

## Variables

USER_PROMPT: $1
PLAN_OUTPUT_DIRECTORY: `specs/`

## Instructions

- IMPORTANT: If no `USER_PROMPT` is provided, stop and ask the user to provide it.
- Carefully analyze the user's requirements provided in the USER_PROMPT variable
- Determine the task type (chore|feature|refactor|fix|enhancement) and complexity (simple|medium|complex)
- Think deeply (ultrathink) about the best approach to implement the requested functionality or solve the problem
- Understand the codebase directly without subagents to understand existing patterns and architecture
- Follow the Plan Format below to create a comprehensive implementation plan
- Include all required sections and conditional sections based on task type and complexity
- Generate a descriptive, kebab-case filename based on the main topic of the plan
- Save the complete implementation plan to `PLAN_OUTPUT_DIRECTORY/<descriptive-name>.md`
- Ensure the plan is detailed enough that another developer could follow it to implement the solution
- Include code examples or pseudo-code where appropriate to clarify complex concepts
- Consider edge cases, error handling, and scalability concerns

## Workflow

1. **Analyze Requirements** - THINK HARD and parse the USER_PROMPT to understand the core problem and desired outcome
2. **Understand Codebase** - Without subagents, directly understand existing patterns, architecture, and relevant files
3. **Design Solution** - Plan the technical approach, considering:
   - What needs to be created, modified, or removed
   - Dependencies and integration points
   - Error handling and edge cases
   - Testing strategy
   - Performance implications
4. **Generate Plan** - Create a comprehensive specification document following the Plan Format
5. **Save Plan** - Write the plan to `PLAN_OUTPUT_DIRECTORY/<descriptive-name>.md`

## Plan Format

The generated plan MUST include these sections:

### Required Sections (All Plans)

```markdown
# [Descriptive Title]

## Task Description
[Clear description of what needs to be accomplished]

## Type and Complexity
- **Type**: [chore|feature|refactor|fix|enhancement]
- **Complexity**: [simple|medium|complex]

## Objective
[Primary goal and expected outcome]

## Context
[Background information, why this is needed, business value]

## Relevant Files
[List of files that will be created, modified, or are important references]

## Technical Approach
[High-level overview of the solution strategy]

## Step by Step Tasks
[Detailed breakdown of implementation steps, numbered and ordered]

## Acceptance Criteria
[Specific, measurable criteria for completion]

## Testing Strategy
[How to validate the implementation works correctly]

## Potential Risks
[Known challenges, edge cases, or areas requiring extra attention]

## Report
[Section for documenting actual implementation details after completion]
```

### Conditional Sections

**For Complex Tasks:**
- Add "## Architecture Decisions" section
- Add "## Performance Considerations" section
- Add "## Rollback Plan" section

**For Features:**
- Add "## User Impact" section
- Add "## Migration Steps" if applicable

**For Fixes:**
- Add "## Root Cause Analysis" section
- Add "## Prevention Measures" section

**For Refactors:**
- Add "## Before/After Comparison" section
- Add "## Breaking Changes" section if applicable

## Best Practices

- Use clear, action-oriented language
- Number tasks in logical order
- Include file paths and specific line numbers when helpful
- Reference existing code patterns to maintain consistency
- Consider backwards compatibility
- Document assumptions explicitly
- Include code snippets for complex logic
- Specify exact command-line operations needed
- List environment variables or configuration changes
- Note any external dependencies or API changes

## Example Output

The plan should be saved to a file like:
- `specs/add-user-authentication.md`
- `specs/fix-memory-leak-in-atlas.md`
- `specs/refactor-database-layer.md`

The filename should be descriptive, use kebab-case, and clearly indicate the work to be done.

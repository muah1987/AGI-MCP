---
description: Implement the plan from a specification file
argument-hint: [path-to-plan]
model: inherit
---

# Build

Follow the `Workflow` to implement the `PATH_TO_PLAN` then `Report` the completed work.

## Variables

PATH_TO_PLAN: $ARGUMENTS

## Workflow

- If no `PATH_TO_PLAN` is provided, STOP immediately and ask the user to provide it (AskUserQuestion).
- Read and execute the plan at `PATH_TO_PLAN`. Think hard about the plan and implement it into the codebase.
- Follow each step in the plan systematically
- Implement all required files, modifications, and configurations
- Test implementations as you go
- Ensure all acceptance criteria from the plan are met
- Document any deviations from the original plan and why they were necessary

## Report

- Present the `## Report` section of the plan.
- Summarize what was implemented
- List all files created or modified
- Note any outstanding items or issues
- Confirm all acceptance criteria are met

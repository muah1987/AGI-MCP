---
description: Creates a concise engineering implementation plan based on user requirements and saves it to specs directory
argument-hint: [user prompt] [orchestration prompt]
model: inherit
disallowed-tools: Task, EnterPlanMode
hooks:
  Stop:
    - hooks:
        - type: command
          command: >-
            $HOME/.local/bin/uv run $AGI_MCP_PROJECT_DIR/.agi-mcp/hooks/validators/validate_new_file.py
            --directory specs
            --extension .md
        - type: command
          command: >-
            $HOME/.local/bin/uv run $AGI_MCP_PROJECT_DIR/.agi-mcp/hooks/validators/validate_file_contains.py
            --directory specs
            --extension .md
            --contains '## Task Description'
            --contains '## Objective'
            --contains '## Relevant Files'
            --contains '## Step by Step Tasks'
            --contains '## Acceptance Criteria'
            --contains '## Team Orchestration'
            --contains '### Team Members'
---

# Plan With Team

Create a detailed implementation plan based on the user's requirements provided through the `USER_PROMPT` variable. Analyze the request, think through the implementation approach, and save a comprehensive specification document to `PLAN_OUTPUT_DIRECTORY/<name-of-plan>.md` that can be used as a blueprint for actual development work. Follow the `Instructions` and work through the `Workflow` to create the plan.

## Variables

USER_PROMPT: $1
ORCHESTRATION_PROMPT: $2 - (Optional) Guidance for team assembly, task structure, and execution strategy
PLAN_OUTPUT_DIRECTORY: `specs/`
TEAM_MEMBERS: `.agi-mcp/agents/team/*.md`
GENERAL_PURPOSE_AGENT: `general-purpose`

## Instructions

- **PLANNING ONLY**: Do NOT build, write code, or deploy agents. Your only output is a plan document saved to `PLAN_OUTPUT_DIRECTORY`.
- If no `USER_PROMPT` is provided, stop and ask the user to provide it.
- If `ORCHESTRATION_PROMPT` is provided, integrate its guidance into team assembly and task structure.
- Read all available team member files from `TEAM_MEMBERS` directory to understand available specialists.
- Analyze the `USER_PROMPT` to identify:
  - Core objectives and deliverables
  - Technical requirements and constraints
  - Areas requiring specialized expertise
  - Dependencies and sequencing
- Create a comprehensive plan document following the structure below.
- Save the plan to `PLAN_OUTPUT_DIRECTORY` with a descriptive filename (kebab-case, e.g., `implement-auth-system.md`).

## Workflow

1. **Understand Requirements**
   - Parse `USER_PROMPT` to extract key requirements
   - Identify technical complexity and scope
   - Determine success criteria

2. **Analyze Team Capabilities**
   - Read available team member profiles from `.agi-mcp/agents/team/*.md`
   - Map required skills to available specialists
   - Identify if general-purpose agent is needed

3. **Create Implementation Plan**
   - Break down work into logical phases/tasks
   - Assign tasks to appropriate team members based on expertise
   - Define task dependencies and sequencing
   - Establish acceptance criteria

4. **Document the Plan**
   - Create a structured markdown document
   - Include all required sections (see structure below)
   - Provide clear, actionable task descriptions
   - Define team orchestration strategy

5. **Save and Validate**
   - Write the plan to `PLAN_OUTPUT_DIRECTORY/<descriptive-name>.md`
   - Ensure all required sections are present
   - Validate structure meets specification requirements

## Plan Document Structure

Your plan document MUST include these sections:

### ## Task Description
A concise description of what needs to be accomplished, derived from `USER_PROMPT`.

### ## Objective
The primary goal and success criteria for this implementation.

### ## Relevant Files
List of files that will be:
- Created (new files)
- Modified (existing files to change)
- Referenced (existing files to understand)

Format:
```
- **Create**: `path/to/new/file.ts` - Purpose
- **Modify**: `path/to/existing/file.ts` - Changes needed
- **Reference**: `path/to/reference/file.ts` - Context needed
```

### ## Step by Step Tasks
Detailed breakdown of implementation tasks in logical sequence:

1. **Task Name** (Assigned to: agent-name)
   - Description of what needs to be done
   - Expected outcomes
   - Dependencies (if any)

2. **Next Task** (Assigned to: another-agent)
   - And so on...

### ## Acceptance Criteria
Clear, testable criteria that define when the implementation is complete:

- [ ] Criterion 1
- [ ] Criterion 2
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Code reviewed

### ## Team Orchestration

#### ### Team Members
List of agents assigned to this project with their roles:

- **agent-name** - Specialist in X, responsible for Y
- **another-agent** - Specialist in Z, responsible for W
- **general-purpose** - Handles integration and coordination

#### ### Execution Strategy
How the team will work together:
- Sequential vs. parallel execution
- Handoff points between agents
- Communication and integration approach
- Quality assurance process

#### ### Coordination Notes
- Dependencies between team members
- Integration points
- Review and validation process
- Escalation path for blockers

## Example Output

```markdown
# Implementation Plan: User Authentication System

## Task Description
Implement a secure user authentication system with JWT tokens, password hashing, and session management based on user requirements.

## Objective
Create a production-ready authentication system that:
- Securely authenticates users with email/password
- Issues and validates JWT tokens
- Manages user sessions with refresh tokens
- Follows security best practices

## Relevant Files

- **Create**: `src/auth/auth-service.ts` - Core authentication logic
- **Create**: `src/auth/jwt-manager.ts` - JWT token generation and validation
- **Create**: `src/auth/password-hasher.ts` - Bcrypt password hashing
- **Create**: `src/middleware/auth-middleware.ts` - Express authentication middleware
- **Create**: `tests/auth/auth-service.test.ts` - Authentication service tests
- **Modify**: `src/database/schema.ts` - Add users and sessions tables
- **Modify**: `src/app.ts` - Register authentication routes
- **Reference**: `src/database/memory-db.ts` - Database connection patterns

## Step by Step Tasks

1. **Design Database Schema** (Assigned to: architect)
   - Design users and sessions tables
   - Define indexes for performance
   - Plan migration strategy
   - Dependencies: None

2. **Implement Password Hashing** (Assigned to: security-engineer)
   - Create password hashing service using bcrypt
   - Implement salt generation
   - Add password validation
   - Dependencies: Task 1

3. **Build JWT Token Manager** (Assigned to: backend-developer)
   - Implement JWT token generation
   - Create token validation logic
   - Handle token refresh mechanism
   - Dependencies: Task 1

4. **Create Authentication Service** (Assigned to: backend-developer)
   - Implement user registration
   - Build login functionality
   - Create logout and session management
   - Dependencies: Task 2, Task 3

5. **Add Authentication Middleware** (Assigned to: backend-developer)
   - Create Express middleware for protected routes
   - Implement role-based access control
   - Add error handling
   - Dependencies: Task 4

6. **Write Comprehensive Tests** (Assigned to: test-engineer)
   - Unit tests for all services
   - Integration tests for auth flow
   - Security-focused edge case tests
   - Dependencies: Task 5

7. **Documentation and Review** (Assigned to: document-writer)
   - API documentation
   - Security best practices guide
   - Integration examples
   - Dependencies: Task 6

## Acceptance Criteria

- [ ] Users can register with email and password
- [ ] Users can login and receive JWT token
- [ ] JWT tokens are validated on protected routes
- [ ] Passwords are securely hashed with bcrypt
- [ ] Refresh tokens work correctly
- [ ] All unit tests pass (100% coverage on auth logic)
- [ ] Integration tests pass
- [ ] Security review completed
- [ ] API documentation complete
- [ ] Code reviewed by security-engineer

## Team Orchestration

### Team Members

- **architect** - Database design specialist, responsible for schema design and migration planning
- **security-engineer** - Security specialist, responsible for password hashing and security review
- **backend-developer** - TypeScript/Express expert, responsible for core authentication logic and middleware
- **test-engineer** - Testing specialist, responsible for comprehensive test coverage
- **document-writer** - Documentation specialist, responsible for API docs and guides
- **general-purpose** - Coordination and integration, handles cross-cutting concerns

### Execution Strategy

**Phase 1: Foundation** (Sequential)
1. Architect designs schema
2. Security-engineer implements password hashing
3. Backend-developer builds JWT manager

**Phase 2: Core Implementation** (Parallel)
- Backend-developer creates auth service and middleware
- Test-engineer prepares test infrastructure

**Phase 3: Validation** (Sequential)
1. Test-engineer writes and runs comprehensive tests
2. Security-engineer performs security review
3. Document-writer creates documentation

**Phase 4: Integration** (Coordinated)
- General-purpose agent handles final integration
- Code review process
- Final validation before deployment

### Coordination Notes

- **Database Dependencies**: All code depending on database must wait for schema implementation
- **Security Review**: Required before final integration
- **Testing Integration**: Tests run continuously during development for fast feedback
- **Documentation**: Updated incrementally as features are completed
- **Review Process**: Each major component reviewed by relevant specialist before integration

### Quality Gates

1. After schema design: Architect approval required
2. After password hashing: Security review required  
3. After core auth service: Unit test coverage > 90% required
4. Before final integration: All acceptance criteria must be met
5. Final gate: Security-engineer sign-off required

```

## Notes

- Keep plans concise but comprehensive
- Be specific about file paths and components
- Assign tasks based on actual team member expertise
- Consider dependencies and sequencing carefully
- Make acceptance criteria measurable and testable
- Focus on what to build, not how to build it (that's for the agents)
- If team members don't exist, recommend creating them or use general-purpose
- Save the plan with a descriptive filename reflecting the work

## Validation

After creating the plan, the Stop hooks will automatically validate:
1. A new `.md` file was created in `specs/` directory
2. The file contains all required sections:
   - Task Description
   - Objective
   - Relevant Files
   - Step by Step Tasks
   - Acceptance Criteria
   - Team Orchestration
   - Team Members

If validation fails, review the plan and ensure all sections are present and properly formatted.

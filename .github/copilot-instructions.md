# GitHub Copilot Instructions for AGI-MCP

This file provides instructions for GitHub Copilot agents working on the AGI-MCP project.

## Directory Structure for Agent Operations

### `.github/spec/` - Specifications and Plans
Location for detailed plans, specifications, and roadmaps. All agents should:
- ✅ Check this directory at session start for ongoing work
- ✅ Create new spec documents for major features or refactoring efforts
- ✅ Update existing specs as work progresses
- ✅ Reference specs in commit messages and PRs

**Naming Convention**: `{topic-name}.md` (e.g., `code-quality-improvements.md`)

### `.github/changelogs/` - Change History
Location for detailed change documentation. All agents should:
- ✅ Create a changelog entry for each significant change
- ✅ Use the template provided in `.github/changelogs/README.md`
- ✅ Include timestamp, agent ID, and change details
- ✅ Link to related commits, issues, and PRs
- ✅ Update changelog BEFORE committing code changes

**Naming Convention**: `YYYY-MM-DD-{change-description}.md` (e.g., `2026-03-14-fix-yaml-parsing.md`)

### `.github/memory/` - Agent Session Logs
Location for agent memory and learning. All agents should:
- ✅ Create a new memory log at session start
- ✅ Load recent memory logs (last 10 sessions) for context
- ✅ Update memory log throughout the session
- ✅ Save complete log at session end
- ✅ Document decisions, learnings, mistakes, and recommendations

**Naming Convention**: `YYYY-MM-DD-HH-MM-SS-{agent-uuid}.md`

## Session Start Checklist

When starting a new session, agents should:

1. **Load Context**:
   - [ ] Read `.github/spec/` for ongoing plans
   - [ ] Review `.github/changelogs/` for recent changes (last 7 days)
   - [ ] Load `.github/memory/` logs (last 10 sessions)
   - [ ] Check for any new issues or PR comments

2. **Create Session Log**:
   - [ ] Create new memory log with timestamp and agent UUID
   - [ ] Document the task/goal for this session
   - [ ] Note the context and any relevant background

3. **Review Standards**:
   - [ ] Check code quality standards in specs
   - [ ] Review past mistakes to avoid repeating them
   - [ ] Note any warnings or recommendations from previous sessions

## During Session

### Before Making Changes
- [ ] Check if similar changes were attempted before (search memory logs)
- [ ] Review relevant specs for guidance
- [ ] Consider impact on existing functionality
- [ ] Plan the change incrementally

### Making Changes
- [ ] Make small, focused commits
- [ ] Update changelog for each significant change
- [ ] Update memory log with decisions and reasoning
- [ ] Test changes before committing

### After Changes
- [ ] Run tests to validate changes
- [ ] Update documentation if needed
- [ ] Request code review
- [ ] Run security scans
- [ ] Update memory log with results

## Session End Checklist

Before ending a session:

1. **Update Documentation**:
   - [ ] Complete changelog entries for all changes
   - [ ] Update specs if plans changed
   - [ ] Finalize memory log with complete session details

2. **Quality Checks**:
   - [ ] All tests pass
   - [ ] No linter errors
   - [ ] No security vulnerabilities introduced
   - [ ] Documentation is current

3. **Knowledge Transfer**:
   - [ ] Document any learnings in memory log
   - [ ] Note any mistakes and how they were fixed
   - [ ] Add recommendations for future sessions
   - [ ] Update relevant specs with insights

4. **Handoff**:
   - [ ] Ensure memory log is complete and saved
   - [ ] Clear status on what's done vs. what remains
   - [ ] Link to related commits, PRs, issues

## Code Quality Standards

### Always Do
- ✅ Use TypeScript types (avoid `any` unless justified)
- ✅ Add JSDoc comments for public APIs
- ✅ Validate all inputs
- ✅ Handle errors explicitly (throw custom errors, don't return null)
- ✅ Write unit tests for new code
- ✅ Use established libraries instead of DIY implementations
- ✅ Check for division by zero and null/undefined
- ✅ Follow existing code style and patterns

### Never Do
- ❌ Use `any` type without justification
- ❌ Return `null` on errors (throw exceptions instead)
- ❌ Ignore errors or fail silently
- ❌ Hardcode values that should be configurable
- ❌ Leave TODOs or FIXMEs without tracking issues
- ❌ Implement manual parsers when libraries exist
- ❌ Skip tests for bug fixes
- ❌ Commit commented-out code

### When Fixing Bugs
1. Understand the root cause before fixing
2. Add a test that reproduces the bug
3. Fix the bug
4. Verify the test now passes
5. Check for similar bugs elsewhere
6. Document the fix in changelog
7. Update memory log with learnings

### When Adding Features
1. Check specs for planned approach
2. Design the API/interface first
3. Write tests before implementation (TDD)
4. Implement incrementally
5. Document as you go
6. Get code review before merging
7. Update specs with actual implementation details

## Learning and Improvement

### Tracking Mistakes
When a mistake is made:
1. Document it in the memory log
2. Explain what went wrong and why
3. Describe how it was fixed
4. Add preventive measures for future sessions

### Continuous Improvement
Agents should:
- Analyze patterns in past mistakes
- Suggest process improvements
- Update these instructions based on learnings
- Share insights across sessions via memory logs

## Communication

### Commit Messages
Format: `{type}: {short description}`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Test additions/changes
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `security`: Security fixes

Example: `fix: prevent division by zero in ATLAS synthesis`

### PR Descriptions
Include:
- What changed and why
- Links to related issues
- Breaking changes (if any)
- Testing performed
- Screenshots for UI changes

### Code Comments
- Explain "why" not "what" (code shows what)
- Document assumptions and constraints
- Note any non-obvious behavior
- Link to relevant issues or docs

## Git Ignore

The following directories are in `.gitignore` and should NOT be committed:
- `.github/spec/`
- `.github/changelogs/`
- `.github/memory/`

These are for GitHub's internal use to improve agent performance and should remain local.

## Questions?

If unclear about any guidelines:
1. Check memory logs for similar situations
2. Review past changelogs for examples
3. Check specs for project-specific guidance
4. Ask the user if still unclear

## Updates to These Instructions

These instructions should be updated when:
- New patterns emerge from repeated sessions
- Mistakes reveal gaps in guidelines
- Process improvements are identified
- New tools or standards are adopted

When updating, document the change in:
- A changelog entry
- The memory log for that session
- Commit message explaining the update

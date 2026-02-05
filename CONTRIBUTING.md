# Contributing to AGI-MCP

Thank you for your interest in contributing to AGI-MCP! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Commit Messages](#commit-messages)
- [Pull Request Process](#pull-request-process)
- [Documentation](#documentation)
- [Community](#community)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/AGI-MCP.git
   cd AGI-MCP
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/muah1987/AGI-MCP.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Build the project**:
   ```bash
   npm run build
   ```
6. **Run tests**:
   ```bash
   npm test
   ```

## How to Contribute

### Reporting Bugs

- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Search existing issues first to avoid duplicates
- Include detailed steps to reproduce
- Specify your environment (OS, Node version, etc.)
- Include error messages and stack traces

### Suggesting Features

- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Clearly describe the use case
- Explain why this feature would be useful
- Consider implementation details
- Be open to discussion and feedback

### Contributing Code

1. **Create a branch** for your work:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our [coding standards](#coding-standards)

3. **Test your changes**:
   ```bash
   npm test
   npm run build
   ```

4. **Commit your changes** with a [good commit message](#commit-messages)

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** using our [PR template](.github/PULL_REQUEST_TEMPLATE.md)

## Development Setup

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Git
- SQLite3 (usually included with Node.js)

### Project Structure

```
AGI-MCP/
├── src/               # TypeScript source code
│   ├── database/     # Database layer (memory-db, infrastructure)
│   ├── gotcha/       # GOTCHA Framework & Thinking Mechanism
│   ├── atlas/        # ATLAS Process
│   ├── hooks/        # Hook System
│   ├── subagents/    # Subagent System
│   └── tools/        # MCP Tools
├── memory/           # Memory infrastructure
├── data/             # Database files (git-ignored)
├── dist/             # Compiled JavaScript (git-ignored)
└── docs/             # Documentation
```

### Building

```bash
# Development build
npm run build

# Watch mode (automatically rebuilds on changes)
npm run build -- --watch
```

### Running Locally

```bash
# Start the MCP server
npm start

# Run tests
npm test
```

## Coding Standards

### TypeScript

- Use TypeScript strict mode
- Define explicit types for all parameters and return values
- Use interfaces for object shapes
- Prefer `const` over `let`, avoid `var`
- Use async/await over callbacks
- Handle errors explicitly

### Code Style

- **Indentation**: 2 spaces
- **Line Length**: Maximum 100 characters
- **Quotes**: Single quotes for strings
- **Semicolons**: Required
- **Naming**:
  - Classes: PascalCase
  - Functions/Variables: camelCase
  - Constants: UPPER_CASE
  - Private members: prefix with `_` or use `private` keyword

### Example

```typescript
export class ExampleService {
  private readonly db: MemoryDatabase;

  constructor(db: MemoryDatabase) {
    this.db = db;
  }

  async processTask(taskId: string, description: string): Promise<Result> {
    try {
      const result = await this.executeTask(taskId, description);
      return { success: true, data: result };
    } catch (error) {
      console.error('Task processing failed:', error);
      return { success: false, error: error.message };
    }
  }
}
```

## Testing Guidelines

### Writing Tests

- Write tests for all new features
- Maintain or improve code coverage
- Test both success and failure cases
- Use descriptive test names

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/database/memory-db.test.ts
```

### Test Structure

```typescript
describe('MemoryDatabase', () => {
  let db: MemoryDatabase;

  beforeEach(() => {
    db = new MemoryDatabase(':memory:');
  });

  afterEach(() => {
    db.close();
  });

  it('should store and retrieve goals', () => {
    const goalId = db.addGoal('Test goal', 5);
    const goals = db.getActiveGoals();
    
    expect(goals).toHaveLength(1);
    expect(goals[0].goal).toBe('Test goal');
  });
});
```

## Commit Messages

### Format

```
type(scope): brief description

Detailed explanation if needed.

Fixes #issue-number
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Build process, dependencies, etc.

### Examples

```
feat(subagents): add security-reviewer subagent

Implements a specialized subagent for security-focused code reviews.
Includes checklist for common vulnerabilities and detailed reporting.

Fixes #123
```

```
fix(hooks): handle missing hook configuration gracefully

Previously crashed when hooks config was missing. Now uses
empty config as default.

Fixes #456
```

## Pull Request Process

### Before Submitting

1. **Update documentation** if you changed APIs or behavior
2. **Add tests** for new functionality
3. **Run all tests** and ensure they pass
4. **Build the project** without errors
5. **Update CHANGELOG.md** with your changes
6. **Rebase on latest main** to avoid conflicts

### PR Template

Use the provided [Pull Request template](.github/PULL_REQUEST_TEMPLATE.md) and fill out all sections:

- Description of changes
- Type of change (bug fix, feature, etc.)
- Testing performed
- Checklist completion

### Review Process

1. **Automated checks** must pass (linting, tests, build)
2. **Code review** by at least one maintainer
3. **Address feedback** promptly and professionally
4. **Maintainer approval** required before merge
5. **Squash and merge** for clean history

### After Merge

- Delete your feature branch
- Pull latest changes from upstream
- Thank the reviewers!

## Documentation

### Types of Documentation

1. **Code Comments**
   - Explain complex logic
   - Document public APIs
   - Use JSDoc format for TypeScript

2. **README Files**
   - Project overview and quick start
   - Installation instructions
   - Basic usage examples

3. **Detailed Guides**
   - In-depth explanations
   - Architecture documentation
   - API reference

4. **Examples**
   - Working code samples
   - Common use cases
   - Best practices

### Documentation Standards

- Write in clear, concise language
- Use code examples liberally
- Keep documentation up-to-date with code
- Use proper Markdown formatting
- Link related documentation

## Community

### Getting Help

- **GitHub Discussions** - Ask questions, share ideas
- **GitHub Issues** - Bug reports and feature requests
- **Documentation** - Read the docs first

### Staying Updated

- **Watch the repository** for notifications
- **Star the project** to show support
- **Follow releases** for new versions

### Communication

- Be respectful and professional
- Provide constructive feedback
- Help others when you can
- Ask clarifying questions
- Be patient with reviewers

## Recognition

Contributors are recognized in:

- **CHANGELOG.md** - For each release
- **GitHub Contributors** - Automatic
- **Documentation** - When appropriate

## License

By contributing to AGI-MCP, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing, please:

1. Check existing documentation
2. Search GitHub Issues
3. Ask in GitHub Discussions
4. Contact the maintainers

Thank you for contributing to AGI-MCP! 🎉

---
description: Comprehensive GitHub operations including repository management, issues, pull requests, code search, workflows, and release management
argument-hint: [operation] [parameters]
model: inherit
---

# GitHub Operations

Perform GitHub operations using the full suite of GitHub MCP tools. This skill provides comprehensive access to GitHub functionality including repository search, code search, issue management, pull request operations, workflow management, and release handling.

## Variables

OPERATION: $1 - The GitHub operation to perform
PARAMETERS: $2 - Operation-specific parameters as JSON

## Available Operations

### Repository Operations

**search_repositories** - Find repositories
```json
{
  "query": "language:typescript stars:>100",
  "sort": "stars|forks|updated",
  "order": "asc|desc",
  "perPage": 30
}
```

**get_file_contents** - Read repository files
```json
{
  "owner": "username",
  "repo": "repository",
  "path": "path/to/file.ts",
  "ref": "branch-name"
}
```

### Code Search

**search_code** - Search across all GitHub repositories
```json
{
  "query": "function handleSubmit language:typescript",
  "sort": "indexed",
  "order": "desc"
}
```

### Issue Management

**list_issues** - List repository issues
```json
{
  "owner": "username",
  "repo": "repository",
  "state": "OPEN|CLOSED",
  "labels": ["bug", "enhancement"],
  "perPage": 30
}
```

**issue_read** - Get issue details
```json
{
  "owner": "username",
  "repo": "repository",
  "issue_number": 123,
  "method": "get|get_comments|get_labels"
}
```

**list_issue_types** - List available issue types for organization
```json
{
  "owner": "organization"
}
```

### Pull Request Operations

**list_pull_requests** - List pull requests
```json
{
  "owner": "username",
  "repo": "repository",
  "state": "open|closed|all",
  "sort": "created|updated|popularity",
  "direction": "asc|desc"
}
```

**search_pull_requests** - Search PRs with advanced filters
```json
{
  "owner": "username",
  "repo": "repository",
  "query": "is:pr author:username label:bug",
  "sort": "created|updated|comments",
  "order": "asc|desc"
}
```

**pull_request_read** - Get PR details
```json
{
  "owner": "username",
  "repo": "repository",
  "pullNumber": 456,
  "method": "get|get_diff|get_status|get_files|get_review_comments|get_reviews|get_comments"
}
```

### Commit Operations

**list_commits** - List repository commits
```json
{
  "owner": "username",
  "repo": "repository",
  "sha": "branch-name",
  "author": "username",
  "perPage": 30
}
```

**get_commit** - Get commit details
```json
{
  "owner": "username",
  "repo": "repository",
  "sha": "commit-hash",
  "include_diff": true
}
```

### Branch and Tag Operations

**list_branches** - List repository branches
```json
{
  "owner": "username",
  "repo": "repository",
  "perPage": 30
}
```

**list_tags** - List repository tags
```json
{
  "owner": "username",
  "repo": "repository",
  "perPage": 30
}
```

**get_tag** - Get tag details
```json
{
  "owner": "username",
  "repo": "repository",
  "tag": "v1.0.0"
}
```

### Release Management

**list_releases** - List repository releases
```json
{
  "owner": "username",
  "repo": "repository",
  "perPage": 30
}
```

**get_latest_release** - Get latest release
```json
{
  "owner": "username",
  "repo": "repository"
}
```

**get_release_by_tag** - Get specific release
```json
{
  "owner": "username",
  "repo": "repository",
  "tag": "v1.0.0"
}
```

### GitHub Actions

**actions_list** - List workflows or runs
```json
{
  "owner": "username",
  "repo": "repository",
  "method": "list_workflows|list_workflow_runs",
  "resource_id": "workflow-id-or-filename"
}
```

**actions_get** - Get workflow details
```json
{
  "owner": "username",
  "repo": "repository",
  "method": "get_workflow|get_workflow_run|get_workflow_job",
  "resource_id": "workflow-id"
}
```

**get_job_logs** - Get workflow job logs
```json
{
  "owner": "username",
  "repo": "repository",
  "job_id": 12345,
  "return_content": true,
  "tail_lines": 500
}
```

### Security Scanning

**list_code_scanning_alerts** - List code scanning alerts
```json
{
  "owner": "username",
  "repo": "repository",
  "state": "open|closed|dismissed|fixed",
  "severity": "critical|high|medium|low"
}
```

**get_code_scanning_alert** - Get alert details
```json
{
  "owner": "username",
  "repo": "repository",
  "alertNumber": 1
}
```

**list_secret_scanning_alerts** - List secret scanning alerts
```json
{
  "owner": "username",
  "repo": "repository",
  "state": "open|resolved"
}
```

**get_secret_scanning_alert** - Get secret alert details
```json
{
  "owner": "username",
  "repo": "repository",
  "alertNumber": 1
}
```

### User Search

**search_users** - Find GitHub users
```json
{
  "query": "location:seattle followers:>100",
  "sort": "followers|repositories|joined",
  "order": "asc|desc"
}
```

### Label Management

**get_label** - Get repository label
```json
{
  "owner": "username",
  "repo": "repository",
  "name": "bug"
}
```

## Workflow

1. **Parse Operation** - Determine which GitHub operation to perform from OPERATION parameter
2. **Validate Parameters** - Ensure PARAMETERS contains required fields for the operation
3. **Execute Operation** - Call appropriate GitHub MCP tool with parameters
4. **Format Results** - Present results in a clear, actionable format
5. **Handle Errors** - Provide helpful error messages if operation fails

## Usage Examples

**Search for repositories:**
```
Operation: search_repositories
Parameters: {"query": "language:typescript mcp server", "sort": "stars"}
```

**List open issues:**
```
Operation: list_issues
Parameters: {"owner": "anthropics", "repo": "mcp", "state": "OPEN"}
```

**Get PR diff:**
```
Operation: pull_request_read
Parameters: {"owner": "user", "repo": "repo", "pullNumber": 42, "method": "get_diff"}
```

**Check workflow status:**
```
Operation: actions_list
Parameters: {"owner": "user", "repo": "repo", "method": "list_workflow_runs"}
```

**Search code across GitHub:**
```
Operation: search_code
Parameters: {"query": "createServer language:typescript"}
```

## Best Practices

- Use specific queries to narrow results
- Leverage pagination for large result sets
- Cache frequently accessed data when appropriate
- Handle rate limits gracefully
- Provide clear error messages
- Format output for readability
- Include relevant links to GitHub UI
- Combine multiple operations for complex workflows

## Error Handling

- Check for authentication errors
- Handle rate limiting with exponential backoff
- Validate repository/owner existence
- Provide actionable error messages
- Suggest corrections for invalid parameters

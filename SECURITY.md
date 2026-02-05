# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The AGI-MCP team takes security seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

**Do not** report security vulnerabilities through public GitHub issues.

Instead, please report them via:

1. **GitHub Security Advisories** (Preferred)
   - Go to the [Security tab](https://github.com/muah1987/AGI-MCP/security)
   - Click "Report a vulnerability"
   - Provide detailed information

2. **Email** (Alternative)
   - Create a private issue with label "security"
   - Include detailed information below

### What to Include

Please provide:

- **Type of vulnerability** (e.g., SQL injection, XSS, code execution)
- **Affected component** (file path, function name, class)
- **Impact** (what an attacker could achieve)
- **Steps to reproduce** (detailed PoC if possible)
- **Suggested fix** (if you have one)
- **Your environment** (OS, Node version, etc.)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 7-14 days
  - High: 14-30 days
  - Medium: 30-60 days
  - Low: 60-90 days

### Disclosure Policy

- **Coordinated Disclosure**: We practice responsible disclosure
- **Public Disclosure**: After a fix is released or 90 days (whichever comes first)
- **Credit**: We acknowledge reporters unless they prefer anonymity

## Security Best Practices

### For Users

1. **Keep Updated**
   - Use the latest version
   - Monitor security advisories
   - Update dependencies regularly

2. **Secure Configuration**
   - Review hook scripts before use
   - Validate subagent configurations
   - Use appropriate permission modes
   - Don't commit secrets to `.agi-mcp/` configs

3. **Database Security**
   - Protect `data/agi-mcp.db` file
   - Use file system permissions
   - Regular backups
   - Don't expose database publicly

4. **Hook Scripts**
   - Review all hook commands
   - Validate input in hooks
   - Use absolute paths
   - Set appropriate timeouts
   - Never execute untrusted scripts

5. **Subagent Safety**
   - Limit tool access appropriately
   - Use read-only modes when possible
   - Review custom subagent prompts
   - Monitor subagent activities

### For Contributors

1. **Code Review**
   - All PRs require security review
   - Look for common vulnerabilities
   - Use automated security scanning
   - Test error handling

2. **Dependencies**
   - Keep dependencies updated
   - Review dependency changes
   - Use `npm audit` regularly
   - Fix vulnerabilities promptly

3. **Input Validation**
   - Validate all user inputs
   - Sanitize data before database queries
   - Use parameterized queries
   - Escape shell commands

4. **Error Handling**
   - Don't leak sensitive info in errors
   - Log security events
   - Fail securely
   - Handle edge cases

5. **Authentication & Authorization**
   - Validate permissions properly
   - Use secure session management
   - Implement rate limiting
   - Protect sensitive operations

## Known Security Considerations

### Hook System

**Risk**: Hooks execute arbitrary shell commands

**Mitigation**:
- Hooks run with user's permissions (not elevated)
- Validate hook commands before adding
- Review hook configurations
- Use timeout protection
- Sandbox hook execution when possible

### Subagent System

**Risk**: Subagents have isolated but privileged access

**Mitigation**:
- Tool restrictions enforced
- Permission modes respected
- All actions logged
- Input validation required

### Database

**Risk**: SQLite database stores all operations

**Mitigation**:
- Parameterized queries (no SQL injection)
- Local file system only
- No network exposure
- File permission protection

### Thinking Mechanism

**Risk**: Evaluates and filters operations

**Mitigation**:
- Safety checks implemented
- Constraint validation
- Risk assessment
- All decisions logged

## Security Features

### Built-in Protections

1. **Input Validation**
   - All tool inputs validated
   - Type checking via TypeScript
   - Parameter sanitization

2. **Database Security**
   - Parameterized queries
   - No SQL injection vectors
   - Local storage only

3. **Hook Validation**
   - Timeout protection
   - Exit code handling
   - Input/output sanitization

4. **Thinking Mechanism**
   - Safety constraint checking
   - Risk level assessment
   - Dangerous operation detection

### Logging & Monitoring

- All operations logged to database
- Session tracking
- Hook execution logs
- Subagent activity logs
- Error and exception logging

## Vulnerability Disclosure Examples

### Example 1: Command Injection

```
Type: Command Injection
Component: src/hooks/hook-system.ts
Impact: Attacker could execute arbitrary commands

Steps to Reproduce:
1. Create hook with malicious command
2. Trigger hook event
3. Command executes with user permissions

Suggested Fix:
Sanitize command input and use allow-list
```

### Example 2: Path Traversal

```
Type: Path Traversal  
Component: src/database/infrastructure.ts
Impact: Could read/write files outside project

Steps to Reproduce:
1. Provide path with ../
2. System accesses parent directories

Suggested Fix:
Validate and normalize all file paths
```

## Security Updates

### How to Stay Informed

- **Watch** this repository for security advisories
- **Check** the [Security tab](https://github.com/muah1987/AGI-MCP/security)
- **Review** CHANGELOG.md for security fixes
- **Subscribe** to release notifications

### Applying Updates

```bash
# Check current version
npm list agi-mcp-server

# Update to latest
npm update agi-mcp-server

# Or reinstall
npm install agi-mcp-server@latest

# Rebuild
npm run build
```

## Bug Bounty

Currently, AGI-MCP does not have a bug bounty program. We appreciate all security reports and will acknowledge contributors in our CHANGELOG and security advisories.

## Contact

For security concerns:

- **GitHub Security**: Use the Security tab
- **Issues**: Create with "security" label (for non-critical)
- **Pull Requests**: Include "[SECURITY]" in title

## Acknowledgments

We thank the following security researchers:

- (List will be updated as reports are received)

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [npm Security](https://docs.npmjs.com/about-security-advisories)

---

**Last Updated**: 2024

Thank you for helping keep AGI-MCP secure! 🔒

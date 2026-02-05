# AGI-MCP Validators

Automated quality assurance validators for AGI-MCP hook integration.

## Overview

These validators integrate with AGI-MCP's hook system to provide automated quality checks without requiring LLM attention. They implement the GOTCHA framework's philosophy of pushing reliability into deterministic code (Tools layer).

## Available Validators

### 1. ty_validator.py

**Purpose**: Type checking for Python files using the `ty` tool

**Hook Type**: PostToolUse (runs after file edits/writes)

**Usage**:
```json
{
  "PostToolUse": [
    {
      "matcher": "Edit|Write",
      "hooks": [
        {
          "type": "command",
          "command": "$AGI_MCP_PROJECT_DIR/.agi-mcp/hooks/validators/ty_validator.py"
        }
      ]
    }
  ]
}
```

**Features**:
- Runs `uvx ty check <file_path>` on edited Python files
- Blocks completion if type errors detected
- Provides detailed error messages for correction
- Graceful degradation if `ty` tool unavailable
- Logs all executions to `ty_validator.log`

**Output**:
- Success: `{}` - allows completion
- Failure: `{"decision": "block", "reason": "<errors>"}` - blocks with details

**Dependencies**: 
- Python 3.11+
- `uv` package manager
- `ty` type checker (auto-installed via `uvx`)

### 2. validate_new_file.py

**Purpose**: Ensures new files are created in expected directories

**Hook Type**: Stop (runs when skill/agent completes)

**Usage**:
```bash
.agi-mcp/hooks/validators/validate_new_file.py --directory specs --extension .md
```

**Features**:
- Verifies file creation in specified directory
- Checks file extension matches expected
- Blocks if expected file not found
- Used by plan-with-team skill to ensure plan files created

### 3. validate_file_contains.py

**Purpose**: Verifies files contain required sections/content

**Hook Type**: Stop (runs when skill/agent completes)

**Usage**:
```bash
.agi-mcp/hooks/validators/validate_file_contains.py \
  --directory specs \
  --extension .md \
  --contains "## Task Description" \
  --contains "## Objective" \
  --contains "## Acceptance Criteria"
```

**Features**:
- Checks for presence of required text patterns
- Supports multiple `--contains` checks
- Blocks if any required section missing
- Used by plan-with-team skill to validate plan structure

## GOTCHA Framework Integration

These validators implement the GOTCHA framework's Tools layer:

- **Goals**: Quality assurance through automated checks
- **Observations**: File contents, type checker output
- **Thoughts**: N/A (deterministic, no reasoning needed)
- **Commands**: Run type checker, validate file structure
- **Hypotheses**: N/A (deterministic checks)
- **Assessments**: Pass/fail based on validation results

By pushing reliability into deterministic validators, we reduce LLM hallucination risk and ensure consistent quality standards.

## Adding New Validators

To create a new validator:

1. Create Python script in this directory
2. Make it executable: `chmod +x validator_name.py`
3. Accept hook input via stdin as JSON
4. Output decision JSON to stdout:
   - `{}` to allow
   - `{"decision": "block", "reason": "..."}` to block
5. Add logging for debugging
6. Document in this README

**Template**:
```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = []
# ///
import json
import sys

def main():
    # Read hook input
    hook_input = json.loads(sys.stdin.read())
    
    # Your validation logic here
    is_valid = validate(hook_input)
    
    if is_valid:
        print(json.dumps({}))
    else:
        print(json.dumps({
            "decision": "block",
            "reason": "Validation failed: ..."
        }))

if __name__ == "__main__":
    main()
```

## Logging

All validators should log to `<validator_name>.log` in this directory for debugging and audit trails.

## Testing Validators

Test validators manually:
```bash
# Prepare test input
echo '{"tool_input": {"file_path": "test.py"}}' | \
  .agi-mcp/hooks/validators/ty_validator.py

# Check output (should be valid JSON)
# Check log file for execution details
cat .agi-mcp/hooks/validators/ty_validator.log
```

## See Also

- [AGI-MCP Hook System Documentation](../../../docs/ADVANCED.md)
- [AGI-MCP SKILLS.md](../../../docs/SKILLS.md) - Skill system integration
- [AGI-MCP ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) - System architecture

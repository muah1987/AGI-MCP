#!/usr/bin/env python3
# Note: This script uses uv for dependency management when available
# Falls back to system Python if uv is not installed
"""
Type Checker Validator for AGI-MCP PostToolUse Hook

Runs `uvx ty check <file_path>` for type checking on single Python files.

GOTCHA Framework Integration:
- Pushes reliability into deterministic code (Tools layer)
- Enforces type safety without requiring LLM attention
- Implements guardrails for consistent Python typing

Outputs JSON decision for AGI-MCP PostToolUse hook:
- {"decision": "block", "reason": "..."} to block and retry
- {} to allow completion

See docs/ARCHITECTURE.md for full GOTCHA framework documentation.
"""
import json
import logging
import subprocess
import sys
from pathlib import Path

# Logging setup - log file next to this script
SCRIPT_DIR = Path(__file__).parent
LOG_FILE = SCRIPT_DIR / "ty_validator.log"

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.FileHandler(LOG_FILE, mode='a')]
)
logger = logging.getLogger(__name__)


def main():
    logger.info("=" * 50)
    logger.info("TY VALIDATOR POSTTOOLUSE HOOK TRIGGERED")

    # Read hook input from stdin (Claude Code passes JSON)
    try:
        stdin_data = sys.stdin.read()
        if stdin_data.strip():
            hook_input = json.loads(stdin_data)
            logger.info(f"hook_input keys: {list(hook_input.keys())}")
        else:
            hook_input = {}
    except json.JSONDecodeError:
        hook_input = {}

    # Extract file_path from PostToolUse stdin
    file_path = hook_input.get("tool_input", {}).get("file_path", "")
    logger.info(f"file_path: {file_path}")

    # Only run for Python files
    if not file_path.endswith(".py"):
        logger.info("Skipping non-Python file")
        print(json.dumps({}))
        return

    # Run uvx ty check on the single file
    logger.info(f"Running: uvx ty check {file_path}")
    try:
        result = subprocess.run(
            ["uvx", "ty", "check", file_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        stdout = result.stdout
        stderr = result.stderr
        returncode = result.returncode

        logger.info(f"returncode: {returncode}")
        logger.info(f"stdout: {stdout}")
        logger.info(f"stderr: {stderr}")

        # If ty check failed, block with error message
        if returncode != 0:
            error_msg = stdout if stdout else stderr
            reason = f"Type checking failed:\n{error_msg}"
            logger.warning(f"Blocking: {reason}")
            
            output = {
                "decision": "block",
                "reason": reason
            }
            print(json.dumps(output))
            return

        # Success - allow completion
        logger.info("Type checking passed")
        print(json.dumps({}))

    except subprocess.TimeoutExpired:
        logger.error("uvx ty check timed out")
        output = {
            "decision": "block",
            "reason": "Type checker timed out after 30 seconds"
        }
        print(json.dumps(output))
    except FileNotFoundError:
        logger.warning("uvx or ty not found - skipping type check")
        # Don't block if tool is missing - allow graceful degradation
        print(json.dumps({}))
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        # Don't block on unexpected errors
        print(json.dumps({}))


if __name__ == "__main__":
    main()

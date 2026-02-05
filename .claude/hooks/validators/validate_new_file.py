#!/usr/bin/env python3
"""
Validator: Check if a new file was created in the specified directory
"""
import argparse
import sys
import os
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description='Validate that a new file was created')
    parser.add_argument('--directory', required=True, help='Directory to check')
    parser.add_argument('--extension', required=True, help='File extension to look for (e.g., .md)')
    args = parser.parse_args()
    
    # Get the project directory
    project_dir = os.environ.get('CLAUDE_PROJECT_DIR', os.getcwd())
    target_dir = os.path.join(project_dir, args.directory)
    
    # Check if directory exists
    if not os.path.exists(target_dir):
        print(f"Error: Directory '{args.directory}' does not exist", file=sys.stderr)
        sys.exit(2)
    
    # Look for files with the specified extension
    files = list(Path(target_dir).glob(f'*{args.extension}'))
    
    if not files:
        print(f"Error: No {args.extension} files found in {args.directory}/", file=sys.stderr)
        print(f"Please create a plan document in the {args.directory}/ directory", file=sys.stderr)
        sys.exit(2)
    
    # Success - file(s) found
    print(f"✓ Found {len(files)} {args.extension} file(s) in {args.directory}/")
    for f in files:
        print(f"  - {f.name}")
    sys.exit(0)

if __name__ == '__main__':
    main()

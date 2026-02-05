#!/usr/bin/env python3
"""
Validator: Check if files in a directory contain required sections
"""
import argparse
import sys
import os
from pathlib import Path

def main():
    parser = argparse.ArgumentParser(description='Validate file contents')
    parser.add_argument('--directory', required=True, help='Directory to check')
    parser.add_argument('--extension', required=True, help='File extension (e.g., .md)')
    parser.add_argument('--contains', action='append', required=True, help='Required content (can specify multiple)')
    args = parser.parse_args()
    
    # Get the project directory
    project_dir = os.environ.get('AGI_MCP_PROJECT_DIR', os.getcwd())
    target_dir = os.path.join(project_dir, args.directory)
    
    # Check if directory exists
    if not os.path.exists(target_dir):
        print(f"Error: Directory '{args.directory}' does not exist", file=sys.stderr)
        sys.exit(2)
    
    # Look for files with the specified extension
    files = list(Path(target_dir).glob(f'*{args.extension}'))
    
    if not files:
        print(f"Error: No {args.extension} files found in {args.directory}/", file=sys.stderr)
        sys.exit(2)
    
    # Check each file for required content
    all_valid = True
    for file_path in files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        missing = []
        for required in args.contains:
            if required not in content:
                missing.append(required)
        
        if missing:
            all_valid = False
            print(f"✗ File {file_path.name} is missing required sections:", file=sys.stderr)
            for m in missing:
                print(f"  - {m}", file=sys.stderr)
        else:
            print(f"✓ File {file_path.name} contains all required sections")
    
    if not all_valid:
        print("\nPlease ensure your plan document includes all required sections.", file=sys.stderr)
        sys.exit(2)
    
    print(f"\n✓ All {len(files)} file(s) validated successfully")
    sys.exit(0)

if __name__ == '__main__':
    main()

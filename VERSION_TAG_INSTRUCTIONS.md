# Version Tag Management

This repository now has automated workflows for managing version tags.

## ✅ Tag v1.0.0 Successfully Created and Pushed

The tag `v1.0.0` has been successfully created and pushed to GitHub!

- **Tag Name**: `v1.0.0`
- **Tag Message**: Release version 1.0.0
- **Type**: Annotated tag
- **Status**: ✅ Pushed to GitHub

## Automated Tag Creation Workflow

A GitHub Actions workflow (`.github/workflows/create-version-tag.yml`) has been created to automate tag creation and pushing.

## What Happens When the Tag is Pushed

Once pushed to GitHub, the tag will:

1. **Trigger the Docker Build Workflow**: The GitHub Actions workflow in `.github/workflows/docker-publish.yml` will automatically:
   - Build the Docker image
   - Tag it with `v1.0.0`, `1.0.0`, and `latest`
   - Push it to DockerHub

2. **Create a Release Point**: The tag marks version 1.0.0 of the AGI-MCP server for future reference

## Verifying the Tag

To verify the tag locally:

```bash
# List all tags
git tag -l

# Show tag details
git show v1.0.0

# List tags with messages
git tag -l -n
```

## How to Use the Automated Workflow

### Method 1: Automatic (on package.json update)

When you update the version in `package.json` and push to the `main` branch, the workflow will automatically:
1. Detect the version change
2. Create a new tag based on the version
3. Push the tag to GitHub
4. Trigger the Docker build workflow

### Method 2: Manual Trigger

You can also manually trigger the workflow from the GitHub Actions tab:

1. Go to **Actions** → **Create and Push Version Tag**
2. Click **Run workflow**
3. Either:
   - Leave version empty to use the version from `package.json`
   - Or enter a specific version (e.g., `1.1.0`)
4. Click **Run workflow**

The workflow will:
- Check if the tag already exists
- Create and push the tag if it doesn't exist
- Skip if the tag already exists

### Method 3: Manual (Old Way)

You can still create tags manually if needed:

```bash
# Update version in package.json
# Then create and push the tag
git tag -a v1.x.x -m "Release version 1.x.x"
git push origin v1.x.x
```

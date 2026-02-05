# Version Tag Created

A git tag `v1.0.0` has been created for this repository based on the version in `package.json`.

## Tag Details

- **Tag Name**: `v1.0.0`
- **Tag Message**: Release version 1.0.0
- **Type**: Annotated tag

## To Push the Tag to GitHub

The tag has been created locally but needs to be pushed to GitHub. To push it, run:

```bash
git push origin v1.0.0
```

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

## Future Version Tags

When you're ready to release a new version:

1. Update the version in `package.json`
2. Create a new tag: `git tag -a v1.x.x -m "Release version 1.x.x"`
3. Push the tag: `git push origin v1.x.x`

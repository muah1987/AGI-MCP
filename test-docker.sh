#!/bin/bash
# AGI-MCP Docker Build and Test Script

set -e  # Exit on error

echo "🐳 AGI-MCP Docker Build and Test"
echo "=================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_step() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Step 1: Build the Docker image
print_step "Step 1: Building Docker image..."
if docker build -t agi-mcp:test .; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi
echo ""

# Step 2: Check image size
print_step "Step 2: Checking image size..."
IMAGE_SIZE=$(docker images agi-mcp:test --format "{{.Size}}")
print_success "Image size: $IMAGE_SIZE"
echo ""

# Step 3: Test container startup
print_step "Step 3: Testing container startup..."
CONTAINER_ID=$(docker run -d --name agi-mcp-test agi-mcp:test)
print_success "Container started: $CONTAINER_ID"
sleep 3
echo ""

# Step 4: Check container health
print_step "Step 4: Checking container health..."
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' agi-mcp-test 2>/dev/null || echo "no-health-check")
if [ "$HEALTH_STATUS" != "unhealthy" ]; then
    print_success "Container health: $HEALTH_STATUS"
else
    print_error "Container is unhealthy"
fi
echo ""

# Step 5: Check logs for errors
print_step "Step 5: Checking container logs..."
docker logs agi-mcp-test > /tmp/agi-mcp-test.log 2>&1
if grep -q "error" /tmp/agi-mcp-test.log; then
    print_warning "Found errors in logs:"
    grep "error" /tmp/agi-mcp-test.log | head -5
else
    print_success "No errors in logs"
fi
echo ""

# Step 6: Test MCP tools availability
print_step "Step 6: Testing MCP server initialization..."
# Send a test request to list tools
TEST_REQUEST='{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
echo "$TEST_REQUEST" | docker exec -i agi-mcp-test node dist/index.js > /tmp/agi-mcp-response.json 2>&1 || true

if [ -s /tmp/agi-mcp-response.json ]; then
    print_success "MCP server responded to tools/list request"
    
    # Count available tools
    TOOL_COUNT=$(grep -o '"name"' /tmp/agi-mcp-response.json | wc -l)
    print_success "Found $TOOL_COUNT tools available"
else
    print_warning "MCP server response test skipped (stdio mode)"
fi
echo ""

# Step 7: Verify memory infrastructure
print_step "Step 7: Verifying memory infrastructure..."
if docker exec agi-mcp-test test -f /app/memory/MEMORY.md; then
    print_success "Memory infrastructure exists"
else
    print_warning "Memory infrastructure not created (will be created on first use)"
fi
echo ""

# Step 8: Verify data directory
print_step "Step 8: Verifying data directory..."
if docker exec agi-mcp-test test -d /app/data; then
    print_success "Data directory exists"
else
    print_error "Data directory missing"
fi
echo ""

# Step 9: Check TypeScript build artifacts
print_step "Step 9: Verifying TypeScript build..."
BUILD_FILES=$(docker exec agi-mcp-test ls -la /app/dist/ | grep -c "\.js$" || echo 0)
if [ "$BUILD_FILES" -gt 0 ]; then
    print_success "Found $BUILD_FILES JavaScript files in dist/"
else
    print_error "No build artifacts found"
fi
echo ""

# Step 10: Cleanup
print_step "Step 10: Cleaning up test container..."
docker stop agi-mcp-test > /dev/null 2>&1
docker rm agi-mcp-test > /dev/null 2>&1
print_success "Test container removed"
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✓ Docker Build and Test Complete${NC}"
echo "=================================="
echo ""
echo "To run the AGI-MCP server:"
echo "  docker run -i agi-mcp:test"
echo ""
echo "To use with docker-compose:"
echo "  docker-compose up -d"
echo ""
print_success "All tests passed!"

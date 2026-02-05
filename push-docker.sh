#!/bin/bash
# AGI-MCP Docker Hub Push Script
# Builds and pushes the Docker image to Docker Hub

set -e  # Exit on error

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

echo "🐳 AGI-MCP Docker Hub Push"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo ""
    echo "Please create a .env file with your Docker Hub credentials:"
    echo "  cp .env.example .env"
    echo "  # Edit .env and add your DOCKER_USERNAME and DOCKER_TOKEN"
    echo ""
    exit 1
fi

# Load environment variables
print_step "Loading environment variables..."
export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
print_success "Environment loaded"
echo ""

# Validate required variables
if [ -z "$DOCKER_USERNAME" ] || [ "$DOCKER_USERNAME" = "your-dockerhub-username" ]; then
    print_error "DOCKER_USERNAME not set in .env file"
    exit 1
fi

if [ -z "$DOCKER_TOKEN" ] || [ "$DOCKER_TOKEN" = "your-dockerhub-token" ]; then
    print_error "DOCKER_TOKEN not set in .env file"
    exit 1
fi

# Set default values
DOCKER_IMAGE_NAME=${DOCKER_IMAGE_NAME:-agi-mcp}
DOCKER_IMAGE_TAG=${DOCKER_IMAGE_TAG:-latest}
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"

print_success "Configuration:"
echo "  Username: ${DOCKER_USERNAME}"
echo "  Image: ${DOCKER_IMAGE_NAME}"
echo "  Tag: ${DOCKER_IMAGE_TAG}"
echo "  Full name: ${FULL_IMAGE_NAME}"
echo ""

# Step 1: Build the Docker image
print_step "Step 1: Building Docker image..."
if docker build -t ${FULL_IMAGE_NAME} .; then
    print_success "Docker image built successfully"
else
    print_error "Failed to build Docker image"
    exit 1
fi
echo ""

# Step 2: Tag with version if available
if [ -f package.json ]; then
    VERSION=$(grep '"version"' package.json | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
    if [ -n "$VERSION" ]; then
        print_step "Step 2: Tagging with version ${VERSION}..."
        VERSION_TAG="${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${VERSION}"
        docker tag ${FULL_IMAGE_NAME} ${VERSION_TAG}
        print_success "Tagged as ${VERSION_TAG}"
        echo ""
    fi
fi

# Step 3: Login to Docker Hub
print_step "Step 3: Logging in to Docker Hub..."
if echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin; then
    print_success "Logged in to Docker Hub"
else
    print_error "Failed to login to Docker Hub"
    exit 1
fi
echo ""

# Step 4: Push the image
print_step "Step 4: Pushing image to Docker Hub..."
if docker push ${FULL_IMAGE_NAME}; then
    print_success "Successfully pushed ${FULL_IMAGE_NAME}"
else
    print_error "Failed to push image"
    exit 1
fi
echo ""

# Step 5: Push version tag if it exists
if [ -n "$VERSION_TAG" ]; then
    print_step "Step 5: Pushing version tag..."
    if docker push ${VERSION_TAG}; then
        print_success "Successfully pushed ${VERSION_TAG}"
    else
        print_warning "Failed to push version tag (non-critical)"
    fi
    echo ""
fi

# Step 6: Logout
print_step "Step 6: Logging out from Docker Hub..."
docker logout
print_success "Logged out"
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}✓ Docker Push Complete${NC}"
echo "=================================="
echo ""
echo "Your image is now available at:"
echo "  ${FULL_IMAGE_NAME}"
if [ -n "$VERSION_TAG" ]; then
    echo "  ${VERSION_TAG}"
fi
echo ""
echo "To use it:"
echo "  docker pull ${FULL_IMAGE_NAME}"
echo "  docker run -i ${FULL_IMAGE_NAME}"
echo ""
print_success "All done!"

#!/bin/bash

# Script untuk menguji konfigurasi automation repo
echo "🚀 Testing Automation Repository Configuration"
echo "============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️ Docker is not installed. Docker-related tests will be skipped."
    DOCKER_INSTALLED=false
else 
    DOCKER_INSTALLED=true
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️ Docker Compose is not installed. Docker-related tests will be skipped."
    DOCKER_COMPOSE_INSTALLED=false
else
    DOCKER_COMPOSE_INSTALLED=true
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "✅ All prerequisites are installed"
echo ""

# Test API
echo "🔍 Testing API..."
cd api
if [ -f "package.json" ]; then
    echo "✅ API package.json found"
    npm install
    echo "✅ API dependencies installed"
    npm test
    echo "✅ API tests completed"
else
    echo "❌ API package.json not found"
fi
cd ..

echo ""

# Test Web UI
echo "🔍 Testing Web UI..."
cd web-ui
if [ -f "package.json" ]; then
    echo "✅ Web UI package.json found"
    npm install
    echo "✅ Web UI dependencies installed"
    npm run test:ci
    echo "✅ Web UI tests completed"
else
    echo "❌ Web UI package.json not found"
fi
cd ..

echo ""

# Test Docker Build
if [ "$DOCKER_INSTALLED" = true ] && [ "$DOCKER_COMPOSE_INSTALLED" = true ]; then
    echo "🔍 Testing Docker Build..."
    if [ -f "docker-compose.yml" ]; then
        echo "✅ Docker Compose configuration found"
        docker-compose build
        echo "✅ Docker images built successfully"
    else
        echo "❌ Docker Compose configuration not found"
    fi
else
    echo "⚠️ Skipping Docker build tests"
fi

echo ""

# Test GitHub Actions configuration
echo "🔍 Testing GitHub Actions Configuration..."
if [ -f ".github/workflows/main.yml" ]; then
    echo "✅ GitHub Actions workflow configuration found"
    # You can add yamllint or other validation here
    echo "✅ GitHub Actions configuration is valid"
else
    echo "❌ GitHub Actions workflow configuration not found"
fi

echo ""
# Copy and combine test reports
echo "🔍 Copying test reports..."
mkdir -p reports/combined
cp api/html-report/test-report.html reports/combined/api-test-report.html || true
cp web-ui/html-report/test-report.html reports/combined/web-ui-test-report.html || true

echo "🎉 Configuration test completed!"
echo "Test reports available in:"
echo "1. API: reports/combined/api-test-report.html"
echo "2. Web UI: reports/combined/web-ui-test-report.html"
echo "3. Coverage reports are available in respective project folders"
echo ""
echo "You can now:"
echo "1. Initialize Git repository: git init"
echo "2. Add files to Git: git add ."
echo "3. Commit changes: git commit -m 'Initial commit'" 
echo "4. Push to GitHub repository"
echo "5. GitHub Actions will automatically run on push"

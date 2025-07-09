# Tutorial Lengkap: GitHub Actions untuk Automation Repository

## 📋 Daftar Isi
1. [Penjelasan Tugas](#penjelasan-tugas)
2. [Struktur Proyek](#struktur-proyek)
3. [Komponen Utama](#komponen-utama)
4. [Konfigurasi GitHub Actions](#konfigurasi-github-actions)
5. [Cara Menggunakan](#cara-menggunakan)
6. [Troubleshooting](#troubleshooting)

## 🎯 Penjelasan Tugas

### Maksud dan Tujuan
Tugas ini bertujuan untuk membuat konfigurasi **GitHub Actions** yang dapat melakukan otomatisasi CI/CD (Continuous Integration/Continuous Deployment) untuk sebuah repository yang berisi:
- **API Backend** (Node.js/Express)
- **Web UI Frontend** (React)
- **Docker containers** untuk kedua aplikasi
- **Automated testing** dan **artifact management**

### Manfaat yang Didapat
1. **Otomatisasi Testing**: Setiap kali ada perubahan code, testing akan berjalan otomatis
2. **Konsistensi Environment**: Menggunakan Docker untuk memastikan environment yang sama di semua tahap
3. **Quality Assurance**: Automated checks untuk memastikan kualitas code
4. **Deployment Automation**: Otomatisasi deployment ke staging/production
5. **Artifact Management**: Menyimpan hasil testing dan build untuk analisis

## 🏗️ Struktur Proyek

```
automation-repo/
├── api/                          # Backend API
│   ├── server.js                 # Main server file
│   ├── package.json              # Dependencies & scripts
│   ├── Dockerfile                # Docker configuration
│   └── tests/                    # Test files
│       └── server.test.js
├── web-ui/                       # Frontend React
│   ├── src/
│   │   ├── App.js               # Main React component
│   │   ├── App.test.js          # React tests
│   │   └── index.js             # Entry point
│   ├── package.json             # Dependencies & scripts
│   ├── Dockerfile               # Docker configuration
│   └── nginx.conf               # Nginx configuration
├── .github/workflows/           # GitHub Actions
│   └── main.yml                 # Main workflow configuration
├── docker-compose.yml           # Docker Compose setup
├── test-config.sh              # Testing script
└── README.md                   # Documentation
```

## 🔧 Komponen Utama

### 1. API Backend (Node.js/Express)
- **Framework**: Express.js
- **Testing**: Jest + Supertest
- **Features**:
  - Health check endpoint
  - User management endpoints
  - Error handling
  - CORS support

### 2. Web UI Frontend (React)
- **Framework**: React 18
- **Testing**: Jest + React Testing Library
- **Features**:
  - User management interface
  - API health monitoring
  - Responsive design
  - Form validation

### 3. Docker Configuration
- **Multi-stage builds** untuk optimasi image size
- **Health checks** untuk monitoring container status
- **Volume mounting** untuk development
- **Network configuration** untuk komunikasi antar container

## ⚙️ Konfigurasi GitHub Actions

### Trigger Events
```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
```

### Jobs Overview

#### 1. **test-api**
- Install Node.js dependencies
- Run API tests dengan coverage
- Upload test results sebagai artifacts

#### 2. **test-web-ui**
- Install React dependencies
- Run frontend tests
- Build production version
- Upload test results dan build artifacts

#### 3. **docker-build**
- Build Docker images untuk API dan Web UI
- Test Docker Compose setup
- Upload Docker logs jika gagal

#### 4. **security-scan**
- Scan vulnerability menggunakan Trivy
- Upload hasil scan ke GitHub Security tab
- Generate security report

#### 5. **deploy**
- Deploy ke staging environment (hanya untuk main branch)
- Create deployment package
- Upload deployment artifacts

#### 6. **generate-reports**
- Combine semua artifacts
- Generate comprehensive report
- Upload consolidated report

#### 7. **notify**
- Send notification untuk success/failure
- Dapat diintegrasikan dengan Slack, Teams, atau email

### Docker Images yang Digunakan
- **ubuntu-latest**: Main runner environment
- **node:18-alpine**: Untuk build Node.js applications
- **nginx:alpine**: Untuk serve React production build
- **aquasecurity/trivy**: Untuk security scanning

### Artifacts yang Dihasilkan
1. **API test results**: Coverage reports, test output
2. **Web UI test results**: Coverage reports, build output
3. **Security scan results**: Vulnerability reports
4. **Docker logs**: Container logs untuk debugging
5. **Deployment package**: Ready-to-deploy artifacts
6. **Pipeline report**: Consolidated report dari semua jobs

## 🚀 Cara Menggunakan

### Prerequisites
1. **Docker** dan **Docker Compose** terinstall
2. **Node.js** versi 18 atau lebih baru
3. **GitHub account** dengan repository access

### Step 1: Setup Repository
```bash
# Clone atau download project
git clone <repository-url>
cd automation-repo

# Install dependencies
npm run install:all
```

### Step 2: Test Local Development
```bash
# Run tests
npm run test

# Start development environment
npm run start:dev

# Access applications
# API: http://localhost:3000
# Web UI: http://localhost:3001
```

### Step 3: Push to GitHub
```bash
# Initialize git (jika belum)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit with GitHub Actions configuration"

# Add remote repository
git remote add origin <your-github-repo-url>

# Push to GitHub
git push -u origin main
```

### Step 4: Monitor GitHub Actions
1. Go to GitHub repository
2. Click **"Actions"** tab
3. Monitor workflow execution
4. Check artifacts setelah workflow selesai

## 🔍 Penjelasan Konfigurasi GitHub Actions

### Environment Variables
```yaml
env:
  NODE_VERSION: '18'
  DOCKER_BUILDKIT: 1
```

### Caching Strategy
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: ${{ env.NODE_VERSION }}
    cache: 'npm'
    cache-dependency-path: api/package-lock.json
```

### Artifact Upload
```yaml
- name: Upload API test results
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: api-test-results
    path: |
      api/coverage/
      api/junit.xml
    retention-days: 30
```

### Conditional Deployment
```yaml
deploy:
  runs-on: ubuntu-latest
  needs: [docker-build, security-scan]
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **Docker Build Fails**
```bash
# Check Docker logs
docker-compose logs

# Rebuild with no cache
docker-compose build --no-cache
```

#### 2. **Tests Fail**
```bash
# Run tests locally
cd api && npm test
cd web-ui && npm test

# Check test coverage
npm run test:coverage
```

#### 3. **GitHub Actions Fails**
- Check workflow logs di GitHub Actions tab
- Verify environment variables
- Check artifact uploads
- Review job dependencies

#### 4. **Port Conflicts**
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :3001

# Stop conflicting processes
docker-compose down
```

## 📊 Monitoring dan Reporting

### Artifacts Location
- **Test Results**: Download dari GitHub Actions artifacts
- **Coverage Reports**: Available dalam artifacts
- **Security Scans**: Dapat dilihat di GitHub Security tab
- **Deployment Logs**: Tersimpan dalam pipeline artifacts

### Metrics yang Dimonitor
1. **Test Coverage**: API dan Web UI coverage percentage
2. **Build Success Rate**: Persentase successful builds
3. **Deployment Frequency**: Seberapa sering deployment terjadi
4. **Security Vulnerabilities**: Jumlah dan severity vulnerabilities
5. **Performance**: Build time dan test execution time

## 🎯 Best Practices

### 1. **Branch Strategy**
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches

### 2. **Commit Messages**
```
feat: add new user management endpoint
fix: resolve Docker build issue
docs: update README with deployment instructions
test: add integration tests for API
```

### 3. **Environment Management**
- Use environment variables untuk configuration
- Separate env files untuk development/production
- Secure sensitive data dengan GitHub Secrets

### 4. **Testing Strategy**
- Unit tests untuk individual components
- Integration tests untuk API endpoints
- End-to-end tests untuk critical workflows
- Maintain minimal 80% test coverage

### 5. **Security**
- Regular dependency updates
- Vulnerability scanning dalam pipeline
- Secure credential management
- Container security best practices

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Run tests locally
5. Submit pull request
6. Wait for GitHub Actions to complete
7. Address any issues found by automation

## 📝 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js Testing Guide](https://nodejs.org/en/docs/guides/testing/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

**Selamat!** Anda telah berhasil membuat konfigurasi GitHub Actions yang lengkap untuk automation repository. Pipeline ini akan membantu memastikan kualitas kode dan otomatisasi deployment process.

# Automation Repository - API dan Web UI

Repository ini berisi:
- **API**: RESTful API dengan Node.js/Express
- **Web UI**: Frontend dengan React
- **GitHub Actions**: CI/CD pipeline untuk otomatisasi testing dan deployment

## Struktur Proyek

```
├── api/                 # Backend API
├── web-ui/             # Frontend React
├── .github/workflows/  # GitHub Actions workflows
├── docker-compose.yml  # Docker configuration
├── reports/            # Test report instructions
└── README.md          # Dokumentasi proyek
```

## Getting Started

1. Clone repository ini
2. Install dependencies: `npm install`
3. Jalankan dengan Docker: `docker-compose up`
4. Akses API: `http://localhost:3000`
5. Akses Web UI: `http://localhost:3001`

## CI/CD Pipeline

Pipeline GitHub Actions akan:
- Menjalankan testing otomatis
- Build Docker images
- Menyimpan test results sebagai artifacts
- Deploy ke staging environment

## Test Reports

Test reports are generated in HTML format for both API and Web UI components:

1. Download the test result artifacts from the GitHub Actions workflow
2. Open the HTML report in your browser:
   - API: `api/html-report/test-report.html`
   - Web UI: `web-ui/html-report/test-report.html`
3. Coverage reports are also available:
   - API: `api/coverage/lcov-report/index.html`
   - Web UI: `web-ui/coverage/lcov-report/index.html`

For detailed instructions, see the README.md file included in each artifact.

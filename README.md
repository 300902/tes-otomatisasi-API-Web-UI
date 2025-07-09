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

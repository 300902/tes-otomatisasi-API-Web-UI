#!/bin/bash

# Run API tests
cd api && npm test

# Run Web UI tests
cd ../web-ui && npm test -- --coverage --watchAll=false

# Create combined report directory if it doesn't exist
mkdir -p ../reports/combined

# Copy reports to combined directory
cp api/html-report/test-report.html ../reports/combined/api-test-report.html
cp web-ui/html-report/test-report.html ../reports/combined/web-ui-test-report.html

# Generate index file
cat > ../reports/combined/index.html << EOL
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Combined Test Reports</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
        }
        .reports {
            display: flex;
            gap: 20px;
            margin-top: 20px;
        }
        .report-link {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            text-decoration: none;
            color: #3498db;
            font-weight: bold;
        }
        .report-link:hover {
            background: #e9ecef;
        }
        .timestamp {
            color: #666;
            font-size: 0.9em;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <h1>Combined Test Reports</h1>
    <div class="reports">
        <a href="api-test-report.html" class="report-link">API Test Report</a>
        <a href="web-ui-test-report.html" class="report-link">Web UI Test Report</a>
    </div>
    <p class="timestamp">Generated on: $(date '+%Y-%m-%d %H:%M:%S')</p>
</body>
</html>
EOL

echo "Test reports have been combined and are available in reports/combined/"

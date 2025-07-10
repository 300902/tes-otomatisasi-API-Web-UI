# Test Report Instructions

This directory contains HTML test reports and code coverage reports for both the API and Web UI components of the project.

## How to Open Test Reports

### API Test Report
1. Extract the `api-test-results.zip` file you downloaded from GitHub Actions
2. Navigate to the extracted folder
3. Open the `html-report/test-report.html` file with any web browser:
   - Double-click the file, or
   - Right-click and select "Open with" and choose your browser (Chrome, Firefox, Edge, etc.)

### Web UI Test Report
1. Extract the `web-ui-test-results.zip` file you downloaded from GitHub Actions
2. Navigate to the extracted folder
3. Open the `html-report/test-report.html` file with any web browser:
   - Double-click the file, or
   - Right-click and select "Open with" and choose your browser

## Coverage Reports
Both test results include detailed code coverage reports:

### API Coverage Report
1. From the extracted `api-test-results` folder
2. Navigate to `coverage/lcov-report/`
3. Open the `index.html` file in any web browser
4. This will show you detailed code coverage information for the API

### Web UI Coverage Report
1. From the extracted `web-ui-test-results` folder
2. Navigate to `coverage/lcov-report/`
3. Open the `index.html` file in any web browser
4. This will show you detailed code coverage information for the Web UI

## Tips for Viewing Reports
- Use a modern browser like Chrome, Firefox, or Edge for the best viewing experience
- The HTML reports are fully interactive - you can click on different sections to see more details
- Coverage reports show which lines of code are covered by tests (green) and which are not (red)
- You can navigate through folders in the coverage report to see details for specific files

## Troubleshooting
If you have trouble opening the HTML files:
1. Make sure you've fully extracted the zip file
2. Try using a different browser
3. Check if you have permission to access the files
4. Make sure your browser is not blocking local file access (this is rare but can happen)

## Report Contents
- **Test Reports**: List of all tests run, with pass/fail status and execution time
- **Coverage Reports**: Detailed analysis of which code was executed during tests
- **Summary Statistics**: Overall pass rate and code coverage percentages

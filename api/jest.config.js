module.exports = {
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'API Test Report',
        outputPath: './html-report/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
        dateFormat: 'yyyy-mm-dd HH:MM:ss',
        sort: 'status',
        executionTimeWarningThreshold: 5,
        styleOverridePath: null
      }
    ]
  ],
  testEnvironment: 'node',
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: 'coverage'
};

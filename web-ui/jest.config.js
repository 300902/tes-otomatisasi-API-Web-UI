module.exports = {
  reporters: [
    'default',
    [
      'jest-html-reporter',
      {
        pageTitle: 'Web UI Test Report',
        outputPath: './html-report/test-report.html',
        includeFailureMsg: true,
        includeSuiteFailure: true,
        styleOverridePath: null,
        customScriptPath: null,
        sortResults: true,
        dateFormat: 'yyyy-mm-dd HH:MM:ss',
        executionTimeWarningThreshold: 5,
        executionMode: 'reporter',
        logo: null,
      },
    ],
  ],
  collectCoverage: true,
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageDirectory: 'coverage',
  testEnvironment: 'jsdom',
}

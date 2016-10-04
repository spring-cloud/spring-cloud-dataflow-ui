exports.config = {
  specs: [
    './e2e/**/*.spec.js'
    ],
  baseUrl: 'http://localhost:8000',
  onPrepare: function beforeProtractorRuns() {
    browser.driver.manage().window().setSize(1280, 1024);
  }
}

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.js"],
  collectCoverageFrom: ["src/utils/payroll-engine/**/*.js"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};

module.exports = config;

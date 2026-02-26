const jest = require('jest');

module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: ['src/**/*.js', '!src/**/*.model.js'],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};

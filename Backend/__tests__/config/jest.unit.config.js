module.exports = {
  "rootDir": "../../",
  "setupFiles": ['<rootDir>/__tests__/config/config.shared.js'],
  "coverageThreshold": {
    "global": {
      "branches": 50,
      "functions": 50,
      "lines": 90,
      "statements": -10
    }
  }
};
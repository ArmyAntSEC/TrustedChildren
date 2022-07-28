module.exports = {
    "setupFiles": ['<rootDir>/__tests__/config/config.js'],    
    "coverageThreshold": {
        "global": {
          "branches": 90,
          "functions": 90,
          "lines": 90,
          "statements": -10
        }
    }
};
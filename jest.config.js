const lodash = require('lodash');

module.exports = {
  globals: {
    '_': lodash,
  },
  moduleFileExtensions: ['js'],
  moduleDirectories: ['node_modules', 'src'],
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
};

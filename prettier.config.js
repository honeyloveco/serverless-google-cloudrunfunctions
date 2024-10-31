'use strict';

module.exports = {
  ...require('@serverless/eslint-config/prettier.config'),
  printWidth: 80, // Ensure max line length
  singleQuote: true, // Use single quotes
  trailingComma: 'all', // Add trailing commas where valid in ES5 (objects, arrays, etc.)
  tabWidth: 2, // Set tab width to 2 spaces
  semi: true, // Add semicolons at the ends of statements
  bracketSpacing: true, // Print spaces between brackets in object literals
  arrowParens: 'always', // Include parentheses around a sole arrow function parameter
};

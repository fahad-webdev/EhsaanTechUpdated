// module.exports = {
//     preset: "ts-jest",
//     testEnvironment: "jest-environment-jsdom",
//     transform: {
//       "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
//     },
//     transformIgnorePatterns: ["/node_modules/(?!primereact|@testing-library)"],
//     moduleNameMapper: {
//       "^@/(.*)$": "<rootDir>/src/$1",
//       "\\.(css|less|scss|sass)$": "jest-transform-stub",
//       "\\.(jpg|jpeg|png|gif|webp|svg)$": "jest-transform-stub",
//     },
//     testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"], // ✅ Ensure test files are found
//   };

import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  moduleNameMapper: { // Handle Module Path Aliases
    '^@/(.*)$': '<rootDir>/src/$1', 
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ["/node_modules/(?!primereact|@testing-library)"],
  testMatch: ["<rootDir>/src/**/*.test.{ts,tsx}"],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
  
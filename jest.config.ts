/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['/node_modules/(?!(nanoevents)/)'],
};

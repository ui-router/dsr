module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['src', 'test'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)', '**/?*Spec.[jt]s'],
};

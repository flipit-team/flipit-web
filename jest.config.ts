import type {Config} from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './'
});

// Add any custom config to be passed to Jest
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',

    testPathIgnorePatterns: [
        '<rootDir>/__tests__/utils',
        '<rootDir>/node_modules',
        '<rootDir>/__tests__/e2e',
        '<rootDir>/.next',
        '<rootDir>/package.json',
        '<rootDir>/package-lock.json'
    ],

    verbose: true,
    transformIgnorePatterns: ['/node_modules/(?!swiper)', 'node_modules/(?!(swiper|ssr-window|dom7)/)'],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/__mocks__/cssMock.ts',
        'swiper/css': 'swiper/css'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        'swiper/react': 'jest-transform-stub'
    }
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);

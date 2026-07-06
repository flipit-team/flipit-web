// Local dev uses localhost:8080, production uses real backend
const defaultApiUrl = process.env.NODE_ENV === 'production'
    ? 'https://api.flipit.ng/api/v1'
    : 'http://localhost:8080/api/v1';

const API_BASE_URL = process.env.API_BASE_URL || defaultApiUrl;
const API_BASE_PATH = process.env.API_BASE_PATH || defaultApiUrl;

export {API_BASE_URL, API_BASE_PATH};

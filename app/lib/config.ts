// Use production backend for both development and production
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.flipit.ng/api/v1';
const API_BASE_PATH = process.env.API_BASE_PATH || 'https://api.flipit.ng/api/v1';

export {API_BASE_URL, API_BASE_PATH};

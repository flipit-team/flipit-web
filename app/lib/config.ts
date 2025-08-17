const API_BASE_URL = process.env.NODE_ENV === 'development' 
    ? process.env.API_BASE_URL || 'http://localhost:8080/api/v1'
    : process.env.API_BASE_URL || 'https://api.flipit.ng/api/v1';

const API_BASE_PATH = process.env.NODE_ENV === 'development' 
    ? process.env.API_BASE_PATH || 'http://localhost:8080/api/v1'
    : process.env.API_BASE_PATH || 'https://api.flipit.ng/api/v1';

export {API_BASE_URL, API_BASE_PATH};

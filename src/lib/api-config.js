/**
 * API Configuration Utility
 * Exports the API URL for the MediCore Spring Boot backend.
 */

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const getApiUrl = () => API_BASE;

export default getApiUrl;

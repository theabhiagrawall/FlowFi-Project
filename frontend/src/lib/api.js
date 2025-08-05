

/**
 * A wrapper around the native fetch API.
 * It automatically adds the Authorization header with the JWT token.
 *
 * @param {string} endpoint The API endpoint to call (e.g., '/auth/login').
 * @param {RequestInit} options The options for the fetch call.
 * @returns {Promise<any>} A promise that resolves to the JSON response.
 */
export async function apiFetch(endpoint, options = {}) {
  // Get the token from local storage
  const token = localStorage.getItem('authToken');

  // Prepare the headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add the Authorization header if the token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Get the base URL from environment variables or use a default
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  const url = `${baseURL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If the response is not ok, throw an error
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    // If the response is successful, return the JSON
    return response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

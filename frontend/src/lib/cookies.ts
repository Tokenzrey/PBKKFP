import Cookies from 'universal-cookie';

// Create a new instance of Cookies for managing cookie operations
const cookies = new Cookies();

/**
 * Retrieves the authentication token from cookies.
 * @returns {string | undefined} The stored token, or undefined if it does not exist.
 */
export const getToken = (): string | undefined => {
  return cookies.get('@comick/token');
};

/**
 * Sets the authentication token in cookies.
 * The token is stored with options to enhance security:
 * - `path: '/'`: Available throughout the entire website.
 * - `maxAge`: Sets the expiration time for the cookie in seconds.
 * - `sameSite`: Helps prevent CSRF attacks by controlling how cookies are sent.
 *
 * @param {string} token - The token to be stored.
 * @param {number} [maxAge] - Optional expiration time for the cookie in seconds.
 */
export const setToken = (token: string, expirationTime?: string) => {
  let maxAge;

  // Calculate maxAge from the expiration time if provided
  if (expirationTime) {
    const expirationDate = Date.parse(expirationTime);
    const currentTime = Date.now();
    maxAge = Math.max(0, Math.floor((expirationDate - currentTime) / 1000));
  }

  // Set options for the cookie
  const options = {
    path: '/',
    maxAge: maxAge || 604800, // Default to 7 days (in seconds)
    secure: true,
    // Uncomment the next lines if using HTTPS and to restrict access
    // httpOnly: true, // Prevents client-side access to the cookie (note: may not work with universal-cookie)
    // sameSite: true,
    partitioned: true,
  };

  // Store the token securely
  cookies.set('@comick/token', token, options);
};


/**
 * Removes the authentication token from cookies.
 * This is typically called when a user logs out.
 */
export const removeToken = () => {
  cookies.remove('@comick/token', { path: '/' });
};

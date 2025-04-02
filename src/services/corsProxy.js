/**
 * CORS Proxy Service
 * 
 * This service helps bypass CORS issues during development by providing
 * alternative ways to make API requests when regular fetch/axios fail.
 */

// List of public CORS proxies you can try
const publicProxies = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url='
  ];
  
  /**
   * Try to make a request through multiple CORS proxies
   * 
   * @param {string} url - The API URL to request
   * @param {Object} options - Fetch options
   * @returns {Promise} - The fetch response
   */
  export async function proxyFetch(url, options = {}) {
    // First try direct fetch
    try {
      console.log('Trying direct fetch to:', url);
      const directResponse = await fetch(url, options);
      if (directResponse.ok) {
        console.log('Direct fetch succeeded!');
        return directResponse;
      }
    } catch (error) {
      console.warn('Direct fetch failed:', error.message);
    }
  
    // If direct fetch fails, try public proxies
    let lastError = null;
    
    for (const proxy of publicProxies) {
      try {
        const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
        console.log('Trying proxy fetch via:', proxyUrl);
        
        const proxyResponse = await fetch(proxyUrl, {
          ...options,
          // Some proxies don't support all methods/headers, so we modify as needed
          method: options.method || 'GET',
        });
        
        if (proxyResponse.ok) {
          console.log('Proxy fetch succeeded via:', proxy);
          return proxyResponse;
        }
      } catch (error) {
        console.warn(`Proxy fetch via ${proxy} failed:`, error.message);
        lastError = error;
      }
    }
    
    // If all proxy attempts fail, throw the last error
    throw lastError || new Error('All proxy fetch attempts failed');
  }
  
  /**
   * Make a proxy POST request with JSON data
   * 
   * @param {string} url - The API URL to post to
   * @param {Object} data - The JSON data to send
   * @returns {Promise} - The response
   */
  export async function proxyPost(url, data) {
    const response = await proxyFetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // Parse response based on content type
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  }
  
  export default {
    proxyFetch,
    proxyPost
  };
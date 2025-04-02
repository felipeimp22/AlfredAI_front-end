import axios from 'axios'
import corsProxy from './corsProxy'

// Use the environment variable or fallback to localhost
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002'

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Important: With credentials helps with CORS in some cases
  withCredentials: false,
  timeout: 30000,
});

// Add request interceptor for debugging
apiClient.interceptors.request.use(
  (config) => {
    console.log('🔶 API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('🔴 Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log('🟢 API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('🔴 Response Error:', error);
    
    // Get the error details
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };
    
    console.error('Error Details:', errorDetails);
    return Promise.reject(error);
  }
);

// Restaurant assistant API service
const restaurantApi = {
  /**
   * Send a chat query to the AI assistant using all available methods
   */
  async sendChatQuery(prompt, format = 'json') {
    try {
      const data = { prompt, format };
      const url = `${API_URL}/v1/chat`;
      
      console.log(`Sending request to: ${url}`);
      console.log('Request data:', data);
      
      // Try every possible method to get a response
      const methods = [
        // Method 1: Using Fetch API (most browsers)
        async () => {
          console.log('Trying method 1: Fetch API');
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          }
          return await response.text();
        },
        
        // Method 2: Using Axios
        async () => {
          console.log('Trying method 2: Axios');
          const response = await apiClient.post('/v1/chat', data);
          return response.data;
        },
        
        // Method 3: Using relative URL
        async () => {
          console.log('Trying method 3: Relative URL');
          const response = await fetch('/v1/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return await response.json();
          }
          return await response.text();
        },
        
        // Method 4: Using CORS Proxy
        async () => {
          console.log('Trying method 4: CORS Proxy');
          return await corsProxy.proxyPost(url, data);
        }
      ];
      
      // Try each method in order until one succeeds
      let lastError = null;
      for (const method of methods) {
        try {
          const result = await method();
          console.log('Success with method:', method.name);
          return typeof result === 'string' ? { message: result } : result;
        } catch (error) {
          console.warn(`Method ${method.name} failed:`, error);
          lastError = error;
        }
      }
      
      // If all methods fail, throw the last error
      throw lastError || new Error('All API methods failed');
    } catch (error) {
      console.error('❌ All API attempts failed:', error);
      
      // Return a structured error for the UI
      throw {
        message: error.response?.data?.message || error.message || 'An error occurred while communicating with the server',
        status: error.response?.status,
        originalError: error,
      };
    }
  },

  /**
   * Test the API connection using various methods
   */
  async testConnection() {
    try {
      // Try just doing a GET request to the base URL
      const baseUrlResponse = await fetch(API_URL, { method: 'GET' })
        .catch(error => ({ ok: false, error }));
        
      if (baseUrlResponse.ok) {
        return {
          success: true,
          method: 'Base URL GET',
          status: baseUrlResponse.status,
          message: 'Successfully connected to API base URL'
        };
      }
      
      // Try sending an OPTIONS request to the chat endpoint
      const optionsResponse = await fetch(`${API_URL}/v1/chat`, { method: 'OPTIONS' })
        .catch(error => ({ ok: false, error }));
        
      if (optionsResponse.ok) {
        return {
          success: true,
          method: 'OPTIONS request',
          status: optionsResponse.status,
          message: 'Successfully sent OPTIONS request to API'
        };
      }
      
      // Try the relative URL
      const relativeResponse = await fetch('/v1/chat', { method: 'OPTIONS' })
        .catch(error => ({ ok: false, error }));
        
      if (relativeResponse.ok) {
        return {
          success: true,
          method: 'Relative URL',
          status: relativeResponse.status,
          message: 'Successfully connected via relative URL'
        };
      }
      
      // All basic tests failed
      return {
        success: false,
        error: 'All connection tests failed',
        message: 'Could not connect to API via any method'
      };
    } catch (error) {
      console.error('API connectivity test failed:', error);
      return {
        success: false,
        error: error.message,
        message: 'Could not connect to API'
      };
    }
  },

  /**
   * Request a chart visualization for specific data
   */
  async getChartData(prompt) {
    try {
      const response = await this.sendChatQuery(prompt, 'json');
      
      // If chart data is not available, throw an error
      if (!response.chart && !response.data) {
        throw new Error('No chart data available for this query');
      }
      
      return response;
    } catch (error) {
      console.error('Error getting chart data:', error);
      throw error;
    }
  },
}

export default restaurantApi;
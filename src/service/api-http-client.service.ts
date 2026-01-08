import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

interface ApiOptions {
  authenticated?: boolean;
}

/**
 * TEMPORARY PLACEHOLDER FOR DEVELOPMENT
 *
 * HTTP client configured to work with staging API endpoints.
 * Uses NEXT_PUBLIC_BASE_URL environment variable for API base URL.
 *
 * Current setup:
 * - Auth: Proxied through /api/auth/login to staging API
 * - Other endpoints: Mock data via Next.js API routes
 *
 * TODO: Update base URL and remove mock endpoints when backend is ready
 */
class ApiHttpClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_URL || '',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
          console.info('[ApiHttpClient] Adding Authorization header to request:', config.url);
        } else {
          console.warn('[ApiHttpClient] No token available for request:', config.url);
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          this.clearToken();
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    console.info('[ApiHttpClient] Token set:', token ? `${token.substring(0, 20)}...` : 'None');
  }

  clearToken() {
    this.token = null;
    console.info('[ApiHttpClient] Token cleared');
  }

  async get<TParams, TResponse>(endpoint: string, params?: TParams, options?: ApiOptions): Promise<TResponse> {
    const config: AxiosRequestConfig = { params };
    const response = await this.client.get<TResponse>(endpoint, config);
    return response.data;
  }

  async post<TData, TResponse>(endpoint: string, data?: TData, options?: ApiOptions): Promise<TResponse> {
    const response = await this.client.post<TResponse>(endpoint, data);
    return response.data;
  }

  async put<TData, TResponse>(endpoint: string, data?: TData, options?: ApiOptions): Promise<TResponse> {
    const response = await this.client.put<TResponse>(endpoint, data);
    return response.data;
  }

  async delete<TResponse>(endpoint: string, options?: ApiOptions): Promise<TResponse> {
    const response = await this.client.delete<TResponse>(endpoint);
    return response.data;
  }
}

export const ApiHttpClientService = new ApiHttpClient();

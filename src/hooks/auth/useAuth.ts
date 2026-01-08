import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setUser, setToken, setLoading, setError, logout as logoutAction } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { ApiHttpClientService } from '@/service/api-http-client.service';

interface User {
  id: string;
  email: string;
  name: string;
}

/**
 * TEMPORARY PLACEHOLDER FOR DEVELOPMENT
 *
 * This hook authenticates against staging API to get real tokens.
 * Tokens are stored in Redux + localStorage and set in ApiHttpClientService
 * for authenticated API requests.
 *
 * TODO: Update when proper authentication flow is implemented
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch(setLoading(true));

      const response = await ApiHttpClientService.post<
        { email: string; password: string },
        { user: User; token: string; refreshToken?: string }
      >('/api/auth/login', { email, password });

      console.info('[useAuth] Login response:', {
        hasUser: !!response.user,
        hasToken: !!response.token,
        tokenPreview: response.token ? `${response.token.substring(0, 20)}...` : 'None'
      });

      // Store user data
      dispatch(setUser(response.user));
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      // Store and set authentication token (sent as Authorization header in subsequent requests)
      dispatch(setToken(response.token));
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.token);
        console.info('[useAuth] Token stored in localStorage');
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
      }

      // Set token in API service - will be sent as Authorization header in all requests
      ApiHttpClientService.setToken(response.token);
      console.info('[useAuth] Token set in ApiHttpClientService');

      return true;
    } catch {
      dispatch(setError('Credenciais inválidas'));
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    ApiHttpClientService.clearToken();
    router.push('/login');
  };

  return {
    user: user.data,
    isLoading: user.loading,
    error: user.error,
    login,
    logout,
  };
};

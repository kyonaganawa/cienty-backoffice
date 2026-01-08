import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { setUser, setLoading, setError, logout as logoutAction } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { ApiHttpClientService } from '@/service/api-http-client.service';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, token } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      dispatch(setLoading(true));

      const response = await ApiHttpClientService.post<
        { email: string; password: string },
        { user: any; token: string }
      >('/api/auth/login', { email, password });

      dispatch(setUser(response.user));
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      return true;
    } catch (error) {
      dispatch(setError('Credenciais inválidas'));
      return false;
    }
  };

  const logout = () => {
    dispatch(logoutAction());
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

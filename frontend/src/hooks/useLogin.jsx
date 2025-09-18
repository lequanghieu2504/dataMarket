import { useMutation, useQueryClient } from '@tanstack/react-query';
import { mockAuthService } from '../services/mockAuthService';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { mutate: loginMutation, isPending, error } = useMutation({
    mutationFn: mockAuthService.login,
    onSuccess: (data) => {
      // Invalidate and refetch user data
      queryClient.setQueryData(['authUser'], data);
      // Navigate to home page or dashboard after successful login
      navigate('/dashboard');
    },
    onError: (error) => {
      console.error('Login error:', error);
    }
  });

  return {
    loginMutation,
    isPending,
    error
  };
};

export default useLogin;
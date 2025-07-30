import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setAccessToken } from '@/lib/tokenStore';
import { login } from '@/apiCalls/user';
import { toast } from 'sonner';

export const useLogin = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      login(body.email, body.password),
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      qc.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

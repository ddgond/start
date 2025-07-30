import { useMutation, useQueryClient } from '@tanstack/react-query';
import { register } from '@/apiCalls/user';
import { setAccessToken } from '@/lib/tokenStore';
import { toast } from 'sonner';

export const useRegister = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      register(body.email, body.password),
    onSuccess: ({ accessToken }) => {
      setAccessToken(accessToken);
      qc.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
};

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { logout } from '@/apiCalls/user';
import { setAccessToken } from '@/lib/tokenStore';

export const useLogout = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () =>
      logout(),
    onSuccess: () => {
      setAccessToken(null);
      qc.invalidateQueries({ queryKey: ['user'] });
    },
  });
};

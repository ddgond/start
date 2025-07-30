import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchMe } from "@/apiCalls/user";

export function useUser() {
  const { data } = useSuspenseQuery({
    queryKey: ['user'],
    queryFn: fetchMe,
    staleTime: Infinity,
  });
  return data;
}
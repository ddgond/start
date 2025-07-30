import { type User } from "@/domain/User";
import { jsonFetchWithAuth, jsonFetchWithoutAuth } from "@/lib/jsonFetch";

export async function fetchMe(): Promise<User | null> {
  try {
    return await jsonFetchWithAuth<User>("/user/me");
  } catch {
    return null;
  }
}

export async function login(
  email: string,
  password: string
): Promise<{ accessToken: string }> {
  return await jsonFetchWithoutAuth<{ accessToken: string }>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(
  email: string,
  password: string
): Promise<{ accessToken: string }> {
  return await jsonFetchWithoutAuth<{ accessToken: string }>("/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function logout(): Promise<void> {
  await jsonFetchWithAuth<void>("/logout", {
    method: "POST",
  });
}

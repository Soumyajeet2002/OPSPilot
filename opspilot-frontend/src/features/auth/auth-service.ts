import { api } from "../../lib/api";
import { validLogin } from "./auth-contract";
import type { LoginResponse } from "./auth-contract";
import type { LoginValues } from "./auth-context";

export async function authenticate(
  values: LoginValues,
): Promise<LoginResponse["data"]> {
  const response = await api.post<unknown>("/auth/login", {
    ...values,
    email: values.email.trim().toLowerCase(),
  });
  if (!validLogin(response.data)) throw new Error("Invalid login response");
  return response.data.data;
}

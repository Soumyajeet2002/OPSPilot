import type { User } from "./auth-context";

export interface LoginResponse {
  success: true;
  data: {
    accessToken: string;
    tokenType: "Bearer";
    expiresIn: number;
    user: User;
  };
}

// Validate the external boundary before establishing an authenticated session.
export function validLogin(value: unknown): value is LoginResponse {
  if (
    typeof value !== "object" ||
    value === null ||
    !("success" in value) ||
    value.success !== true ||
    !("data" in value)
  )
    return false;
  const data = value.data;
  if (
    typeof data !== "object" ||
    data === null ||
    !("accessToken" in data) ||
    typeof data.accessToken !== "string" ||
    !data.accessToken.trim() ||
    !("tokenType" in data) ||
    data.tokenType !== "Bearer" ||
    !("expiresIn" in data) ||
    typeof data.expiresIn !== "number" ||
    !Number.isFinite(data.expiresIn) ||
    data.expiresIn <= 0 ||
    !("user" in data)
  )
    return false;
  const user = data.user;
  return (
    typeof user === "object" &&
    user !== null &&
    ["id", "email", "firstName", "lastName"].every(
      (key) => key in user && typeof Reflect.get(user, key) === "string",
    ) &&
    "id" in user &&
    !!user.id &&
    "email" in user &&
    !!user.email
  );
}

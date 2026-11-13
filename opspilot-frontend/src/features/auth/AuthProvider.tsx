import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "../../lib/api";
import { authenticate } from "./auth-service";
import { AuthContext } from "./auth-context";
import type { LoginValues, User } from "./auth-context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const expiresAt = useRef<number>(0);
  const queryClient = useQueryClient();
  const clearSession = useCallback(
    (message: string): void => {
      if (timer.current) clearTimeout(timer.current);
      expiresAt.current = 0;
      setAccessToken(null);
      setUser(null);
      setNotice(message);
      queryClient.clear();
    },
    [queryClient],
  );
  useEffect(() => {
    const expire = (): void =>
      clearSession("Your session expired. Please sign in again.");
    const checkExpiry = (): void => {
      if (expiresAt.current && Date.now() >= expiresAt.current) expire();
    };
    window.addEventListener("opspilot-session-expired", expire);
    window.addEventListener("focus", checkExpiry);
    return () => {
      window.removeEventListener("opspilot-session-expired", expire);
      window.removeEventListener("focus", checkExpiry);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [clearSession]);
  const login = async (values: LoginValues): Promise<void> => {
    const {
      accessToken,
      expiresIn,
      user: identity,
    } = await authenticate(values);
    if (timer.current) clearTimeout(timer.current);
    queryClient.clear();
    setAccessToken(accessToken);
    expiresAt.current = Date.now() + expiresIn * 1000;
    setUser(identity);
    setNotice("");
    timer.current = setTimeout(
      () => clearSession("Your session expired. Please sign in again."),
      Math.min(expiresIn * 1000, 2147483647),
    );
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        notice,
        login,
        endSession: () =>
          clearSession(
            "You ended this browser session. Server session revocation is not available yet.",
          ),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


import api from "../../lib/api";
import type { AuthUser } from "../../lib/tokenStore";
import { tokenStore } from "../../lib/tokenStore";

export type LoginCredentials = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    tokenType: "Bearer";
    expiresIn: number;
    user: AuthUser;
  };
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(
      "/auth/login",
      credentials
    );

    const result = response.data;

    if (!result.success || !result.data?.accessToken) {
      throw new Error(result.message || "Login failed.");
    }

    tokenStore.setSession(
      result.data.accessToken,
      result.data.user
    );

    return result;
  },
};

export function getLoginErrorMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "Something went wrong. Please try again.";
  }

  const axiosError = error as {
    response?: {
      data?: {
        message?: string;
        error?: {
          details?: Array<{
            field?: string;
            messages?: string[];
          }>;
        };
      };
    };
    message?: string;
  };

  const responseData = axiosError.response?.data;

  if (responseData?.error?.details?.length) {
    const validationMessages = responseData.error.details.flatMap(
      (detail) => detail.messages ?? []
    );

    if (validationMessages.length) {
      return validationMessages.join(" ");
    }
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (!axiosError.response) {
    return "Unable to connect to the server. Please check your connection.";
  }

  return "Login failed. Please check your credentials and try again.";
}

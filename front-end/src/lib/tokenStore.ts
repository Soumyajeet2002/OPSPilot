
export type AuthUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

let accessToken: string | null = null;
let currentUser: AuthUser | null = null;

export const tokenStore = {
  setSession(token: string, user: AuthUser) {
    accessToken = token;
    currentUser = user;
  },

  getAccessToken() {
    return accessToken;
  },

  getUser() {
    return currentUser;
  },

  clearSession() {
    accessToken = null;
    currentUser = null;
  },
};

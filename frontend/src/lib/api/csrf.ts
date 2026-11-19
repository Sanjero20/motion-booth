import axios from "axios";

interface CsrfTokenResponse {
  token: string;
}

const csrfClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let csrfToken: string | null = null;
let tokenRequest: Promise<string> | null = null;

export const csrfApi = {
  async getToken(): Promise<string> {
    if (csrfToken) {
      return csrfToken;
    }

    if (!tokenRequest) {
      tokenRequest = csrfClient
        .get<CsrfTokenResponse>("/csrf/token")
        .then(({ data }) => {
          csrfToken = data.token;
          return csrfToken;
        })
        .finally(() => {
          tokenRequest = null;
        });
    }

    return tokenRequest;
  },

  clearToken() {
    csrfToken = null;
  },
};

// DTOs
export type AuthResponse = {
  id: string;
  email: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

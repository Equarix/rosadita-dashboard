export interface ApiResponse<T> {
  message: string;
  body: T;
  status: number;
  token?: string;
  errors?: string[];
}
export interface AuthResponse {
  _id: string;
  username: string;
  password: string;
  role: string;
  userId: number;
  __v: number;
  token: string;
}

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

export interface CategoryResponse {
  _id: string;
  name: string;
  description: string;
  slug: string;
  status: boolean;
  color: string;
  categoryId: number;
  __v: number;
}

export type ColorType = "red" | "blue" | "green" | "yellow" | "purple";

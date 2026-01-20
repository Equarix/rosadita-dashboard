import type { Component } from "./component.interface";

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

export interface ImageResponse {
  _id: string;
  url: string;
  imageId: number;
  __v: number;
}

export type ColorType = "red" | "blue" | "green" | "yellow" | "purple";
export type ImageType = "ROUNDED" | "CIRCLE" | "SQUARE";

export interface ResponseBlog {
  _id: string;
  blogName: string;
  blogSlug: string;
  blogKey: string;
  description: string;
  user: {
    name: string;
  };
  image: ImageResponse;
  category: CategoryResponse;
  timeline: string;
  createdAt: string;
  blogId: number;
  __v: number;
  status: boolean;
  components: Component[];
}

export interface ResponseUser {
  isActive: boolean;
  _id: string;
  username: string;
  password: string;
  role: string;
  userId: number;
  fullName: string;
  __v: number;
  createdAt: string;
}

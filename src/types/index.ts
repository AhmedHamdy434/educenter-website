/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: Meta
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
  method?: HttpMethod;
  url: string;
  params?: Record<string, any>;
  body?: any;
  headers?: HeadersInit;
  cache?: RequestCache;
};

export enum UserRole {
  OWNER = "OWNER",
  TEACHER = "TEACHER",
  STUDENT = "STUDENT",
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: UserRole;
}

export interface LoginResponseData {
  accessToken: string;
  user: User;
}

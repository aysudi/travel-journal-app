import type { ApiError } from "../types/api";

export class ApiConfig {
  private static instance: ApiConfig;
  private baseURL: string;
  private token: string | null = null;

  private constructor() {
    this.baseURL = import.meta.env.VITE_SERVER_URL || "http://localhost:5050";
  }

  public static getInstance(): ApiConfig {
    if (!ApiConfig.instance) {
      ApiConfig.instance = new ApiConfig();
    }
    return ApiConfig.instance;
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem("token", token);
  }

  public getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem("token");
    }
    return this.token;
  }

  public clearToken(): void {
    this.token = null;
    localStorage.removeItem("token");
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  public getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth && this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  public async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          success: false,
          message: `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      if (response.status === 401) {
        this.clearToken();
        window.dispatchEvent(new CustomEvent("auth:logout"));
      }

      throw new Error(errorData.message || "An error occurred");
    }

    try {
      const data = await response.json();
      return data as T;
    } catch (error) {
      throw new Error("Failed to parse response");
    }
  }

  public async request<T>(
    endpoint: string,
    options: RequestInit = {},
    includeAuth: boolean = true
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = this.getHeaders(includeAuth);

    const config: RequestInit = {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }
}

export const apiConfig = ApiConfig.getInstance();

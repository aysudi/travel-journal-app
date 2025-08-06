import { apiConfig } from "./apiConfig";
import type {
  UserProfile,
  UpdateProfileData,
  ChangePasswordData,
  LoginData,
  RegisterData,
  AuthResponse,
} from "../types/api";

export class AuthService {
  private readonly endpoint = "/auth";

  async login(credentials: LoginData): Promise<AuthResponse> {
    const response = await apiConfig.request<AuthResponse>(
      `${this.endpoint}/login`,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      false
    );

    apiConfig.setToken(response.token);

    return response;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiConfig.request<AuthResponse>(
      `${this.endpoint}/register`,
      {
        method: "POST",
        body: JSON.stringify(userData),
      },
      false
    );

    return response;
  }

  async logout(): Promise<void> {
    try {
      await apiConfig.request<void>(`${this.endpoint}/logout`, {
        method: "POST",
      });
    } finally {
      apiConfig.clearToken();
    }
  }

  async forgotPassword(values: {
    email: string;
  }): Promise<{ message: string }> {
    return apiConfig.request(
      `${this.endpoint}/forgot-password`,
      {
        method: "POST",
        body: JSON.stringify(values),
      },
      false
    );
  }

  async resetPassword({
    newPassword,
    email,
  }: {
    newPassword: string;
    email: string;
  }): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/reset-password`,
      {
        method: "POST",
        body: JSON.stringify({ email, newPassword }),
      },
      false
    );
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/verify-email`,
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
      false
    );
  }

  async verifyEmailToken(token: string | null): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/verify-email?token=${token}`
    );
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/resend-verification`,
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      false
    );
  }

  getGoogleAuthUrl(): string {
    return `${apiConfig.getBaseURL()}${this.endpoint}/google`;
  }

  getGitHubAuthUrl(): string {
    return `${apiConfig.getBaseURL()}${this.endpoint}/github`;
  }
}

export class UserService {
  private readonly endpoint = "/auth";

  async getProfile(): Promise<UserProfile> {
    return apiConfig.request<UserProfile>(`${this.endpoint}/profile`);
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    return apiConfig.request<UserProfile>(`${this.endpoint}/profile`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/change-password`,
      {
        method: "PUT",
        body: JSON.stringify(data),
      }
    );
  }

  async uploadProfileImage(file: File): Promise<{ profileImage: string }> {
    const formData = new FormData();
    formData.append("profileImage", file);

    return apiConfig.request<{ profileImage: string }>(
      `${this.endpoint}/upload-image`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${apiConfig.getToken()}`,
        },
      }
    );
  }

  async deleteAccount(): Promise<{ message: string }> {
    return apiConfig.request<{ message: string }>(
      `${this.endpoint}/delete-account`,
      {
        method: "DELETE",
      }
    );
  }

  async getUserById(userId: string): Promise<UserProfile> {
    return apiConfig.request<UserProfile>(`${this.endpoint}/${userId}`);
  }

  async searchUsers(query: string): Promise<UserProfile[]> {
    return apiConfig.request<UserProfile[]>(
      `${this.endpoint}/search?q=${encodeURIComponent(query)}`
    );
  }
}

export const authService = new AuthService();
export const userService = new UserService();

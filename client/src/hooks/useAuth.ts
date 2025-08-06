import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, userService } from "../services";
import type {
  UserProfile,
  LoginData,
  RegisterData,
  ChangePasswordData,
  UpdateProfileData,
} from "../types/api";

// Query Keys
export const authKeys = {
  all: ["auth"] as const,
  profile: () => [...authKeys.all, "profile"] as const,
  user: (id: string) => [...authKeys.all, "user", id] as const,
};

// Get User Profile Hook
export const useUserProfile = () => {
  return useQuery({
    queryKey: authKeys.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 1,
  });
};

// Login Mutation Hook
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginData) => authService.login(credentials),
    onSuccess: () => {
      // Invalidate and refetch user profile after login
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

// Register Mutation Hook
export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });
};

// Update Profile Mutation Hook
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileData) => userService.updateProfile(data),
    onSuccess: (updatedUser: UserProfile) => {
      // Update the cached profile data
      queryClient.setQueryData(authKeys.profile(), updatedUser);
      // Optionally invalidate to refetch from server
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
    },
    onError: (error) => {
      console.error("Profile update failed:", error);
    },
  });
};

// Change Password Mutation Hook
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: ChangePasswordData) => userService.changePassword(data),
    onError: (error) => {
      console.error("Password change failed:", error);
    },
  });
};

// Logout Mutation Hook
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all queries when logging out
      queryClient.clear();
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Even if logout fails on server, clear local data
      queryClient.clear();
    },
  });
};

// Forgot Password Mutation Hook
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (values: { email: string }) =>
      authService.forgotPassword(values),
    onError: (error) => {
      console.error("Forgot password failed:", error);
    },
  });
};

// Reset Password Mutation Hook
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: { newPassword: string; email: string }) =>
      authService.resetPassword(data),
    onError: (error) => {
      console.error("Reset password failed:", error);
    },
  });
};

// Verify Email Mutation Hook
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => authService.verifyEmail(token),
    onError: (error) => {
      console.error("Email verification failed:", error);
    },
  });
};

// Resend Verification Mutation Hook
export const useResendVerification = () => {
  return useMutation({
    mutationFn: (email: string) => authService.resendVerification(email),
    onError: (error) => {
      console.error("Resend verification failed:", error);
    },
  });
};

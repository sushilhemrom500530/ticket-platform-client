/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useCallback } from "react";
import { message } from "antd";
import useApi from './../use-api/index';
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


export interface LoginPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
}

export function useAuthService() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /** 🔹 Login */
  const login = useCallback(async (payload: LoginPayload) => {
    setLoading(true);
    try {
      const { data } = await useApi.post("/auth/login", payload);
      message.success("Login successful");
      return data;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔹 Forgot Password */
  const forgotPassword = useCallback(async (payload: ForgotPasswordPayload) => {
    setLoading(true);
    try {
      const { data } = await useApi.post("/auth/forgot-password", payload);
      message.success("OTP sent to your email");
      return data;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Failed to send OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔹 Verify OTP */
  const verifyOtp = useCallback(async (payload: VerifyOtpPayload) => {
    setLoading(true);
    try {
      const { data } = await useApi.post("/auth/verify-otp", payload);
      message.success("OTP verified successfully");
      return data;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Invalid OTP");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  const resendOtp = useCallback(async (payload: ForgotPasswordPayload) => {
    setLoading(true);
    try {
      const { data } = await useApi.post("/auth/resend-otp", payload);
      message.success("OTP Send successfully. Please check your email");
      return data;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Invalid Request");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /** 🔹 Reset Password */
  const resetPassword = useCallback(async (payload: ResetPasswordPayload) => {
    setLoading(true);
    try {
      const { data } = await useApi.post("/auth/reset-password", payload);
      message.success("Password reset successful");
      return data;
    } catch (error: any) {
      message.error(error?.response?.data?.message || "Reset failed");
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logoutUser = () => {
    // Remove token cookie
    Cookies.remove("token");
    message.success("User Logout Successfully")
    // Redirect to login
    router.push("/auth/login");
  }

  return { login, forgotPassword, verifyOtp, resetPassword, loading, logoutUser, resendOtp };
}

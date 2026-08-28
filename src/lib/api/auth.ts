// Typed auth API calls against duffleup-api's /api/v1/auth/* endpoints.
//
// The token envelope { user, accessToken, refreshToken } matches login,
// register, and google. Refresh returns just the token pair. All calls throw
// `ApiError` on non-2xx (see client.ts).

import { apiFetch, apiMutate } from './client'

export interface AuthUser {
  id: string
  email: string
  phone?: string | null
  firstName?: string
  lastName?: string
  profilePhoto?: string | null
  role: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  isKycComplete?: boolean
  createdAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResult extends AuthTokens {
  user: AuthUser
}

export interface GoogleAuthResult extends AuthResult {
  isNewUser: boolean
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
}

export function login(payload: LoginPayload): Promise<AuthResult> {
  return apiMutate<AuthResult>('/auth/login', { body: payload })
}

export function register(payload: RegisterPayload): Promise<AuthResult> {
  return apiMutate<AuthResult>('/auth/register', { body: payload })
}

export function googleLogin(idToken: string): Promise<GoogleAuthResult> {
  return apiMutate<GoogleAuthResult>('/auth/google', { body: { idToken } })
}

export function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  return apiMutate<AuthTokens>('/auth/refresh', { body: { refreshToken } })
}

export function logout(refreshToken: string): Promise<{ message: string }> {
  return apiMutate<{ message: string }>('/auth/logout', { body: { refreshToken } })
}

export function fetchMe(authToken: string): Promise<AuthUser> {
  return apiFetch<AuthUser>('/auth/me', { authToken })
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return apiMutate<{ message: string }>('/auth/forgot-password', { body: { email } })
}

export function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  return apiMutate<{ message: string }>('/auth/reset-password', {
    body: { token, newPassword },
  })
}

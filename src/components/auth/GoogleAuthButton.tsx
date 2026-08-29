'use client'

import { GoogleLogin } from '@react-oauth/google'
import { useAuth } from '@/lib/auth/AuthProvider'

interface Props {
  onSuccess: () => void
  onError: (message: string) => void
}

// Renders Google Identity Services' one-tap button and exchanges the returned
// credential (ID token) for a Duffleup session via the auth context.
export default function GoogleAuthButton({ onSuccess, onError }: Props) {
  const { loginWithGoogle } = useAuth()

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={async (res) => {
          if (!res.credential) {
            onError('Google sign-in failed. Please try again.')
            return
          }
          try {
            await loginWithGoogle(res.credential)
            onSuccess()
          } catch {
            onError('Google sign-in failed. Please try again.')
          }
        }}
        onError={() => onError('Google sign-in failed. Please try again.')}
        text="continue_with"
        shape="rectangular"
        width="320"
        logo_alignment="left"
      />
    </div>
  )
}

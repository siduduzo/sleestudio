'use client'

import { useAuth, UserButton, SignInButton } from '@clerk/nextjs'

export default function NavUser() {
  const { isSignedIn } = useAuth()

  return (
    <div className="flex items-center gap-3">
      {isSignedIn ? (
        <UserButton />
      ) : (
        <SignInButton mode="modal">
          <button className="px-4 py-2 text-sm font-medium bg-white/[0.07] hover:bg-white/[0.12] rounded-lg border border-white/10 transition-colors">
            Sign in
          </button>
        </SignInButton>
      )}
    </div>
  )
}

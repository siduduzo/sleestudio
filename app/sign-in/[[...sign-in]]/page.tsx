import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center px-4">
      <SignIn />
    </div>
  )
}

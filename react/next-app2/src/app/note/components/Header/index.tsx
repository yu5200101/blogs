import { signIn, signOut, auth } from "@/lib/auth"
import { HTMLAttributes } from "react"
import type { ProviderId } from "@auth/core/providers"
import Link from 'next/link'
interface SignInProps extends HTMLAttributes<HTMLButtonElement> {
  provider?: ProviderId
}

function SignIn({
  provider,
  ...props
}: SignInProps) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn(provider)
      }}
    >
      <button {...props}>Sign In</button>
    </form>
  )
}

function SignOut(props: HTMLAttributes<HTMLButtonElement>) {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <button {...props}>
        Sign Out
      </button>
    </form>
  )
}

export default async function Header() {
  const session = await auth()
  return (
    <header style={{ display: "flex", "justifyContent": "space-around" }}>
      <Link href="/client">Client Side Component</Link>
      {
        session?.user
          ? <span style={{ display: "flex", "alignItems": "center" }}>{session?.user.name}<SignOut /></span>
          : <SignIn />
      }
    </header>
  )
}
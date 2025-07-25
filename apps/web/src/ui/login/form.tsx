import { User } from "@coat-rack/core/models"
import { Button } from "@coat-rack/ui/components/button"
import { Input } from "@coat-rack/ui/components/input"
import { useState } from "react"

interface Props {
  onLogin: (user: User) => void
  logIn: (username: string) => Promise<User | undefined>
  signUp: (username: string) => Promise<User>
}

export const LoginForm = ({ onLogin, logIn, signUp }: Props) => {
  const [username, setUsername] = useState("")
  const [error, setError] = useState("")

  const handleLogIn = () =>
    logIn(username)
      .then((result) => {
        if (result) {
          onLogin(result)
        } else {
          setError("User not found")
        }
      })
      .catch(() => setError("Invalid login"))

  const handleSignUp = () =>
    signUp(username)
      .then((user) => onLogin(user))
      .catch(() => setError("Invalid username"))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleLogIn()
      }}
      className="flex flex-col gap-4 p-4"
    >
      <h1 className="font-title text-5xl">Login</h1>

      <Input onChange={(e) => setUsername(e.target.value)} value={username} />

      <Button type="submit">Log In</Button>
      <Button type="button" onClick={handleSignUp}>
        Sign Up
      </Button>

      <div>{error && <p className="text-red-500">{error}</p>}</div>
    </form>
  )
}

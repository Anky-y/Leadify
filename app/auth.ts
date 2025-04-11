"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// In a real app, this would be a database call
const MOCK_USERS = [
  {
    id: "1",
    email: "user@example.com",
    password: "password123", // In a real app, this would be hashed
    name: "Demo User",
    subscribed: false,
  },
  {
    id: "2",
    email: "premium@example.com",
    password: "password123", // In a real app, this would be hashed
    name: "Premium User",
    subscribed: true,
  },
]

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // In a real app, you would validate credentials against a database
  const user = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

  if (!user) {
    return { success: false, message: "Invalid email or password" }
  }

  // Set a cookie to maintain the session
  // In a real app, you would use a proper session management system
  cookies().set(
    "user",
    JSON.stringify({
      id: user.id,
      email: user.email,
      name: user.name,
      subscribed: user.subscribed,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  // Redirect to dashboard
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string

  // In a real app, you would validate the input and create a new user in the database
  // For this demo, we'll just check if the email is already in use
  const existingUser = MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (existingUser) {
    return { success: false, message: "Email already in use" }
  }

  // In a real app, you would create a new user in the database
  // For this demo, we'll just set a cookie as if the user was created
  cookies().set(
    "user",
    JSON.stringify({
      id: "new-user-id",
      email,
      name: `${firstName} ${lastName}`,
      subscribed: false,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    },
  )

  // Redirect to dashboard
  redirect("/dashboard")
}

export async function logout() {
  cookies().delete("user")
  redirect("/login")
}

export async function getUser() {
  const userCookie = cookies().get("user")

  if (!userCookie) {
    return null
  }

  try {
    return JSON.parse(userCookie.value)
  } catch (error) {
    return null
  }
}

export async function requireAuth() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return user
}

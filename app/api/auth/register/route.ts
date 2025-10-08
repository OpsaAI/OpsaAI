import { type NextRequest, NextResponse } from "next/server"
import { createUser, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    try {
      const user = await createUser(email, password, name)
      const token = await createSession(user.id)

      const response = NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          email_verified: user.email_verified,
        },
      })

      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
      })

      return response
    } catch (error: any) {
      if (error.message?.includes("duplicate key") || error.code === "23505") {
        return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
      }
      throw error
    }
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

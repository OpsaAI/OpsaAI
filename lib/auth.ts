import { neon } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const sql = neon(process.env.DATABASE_URL!)

const JWT_SECRET = process.env.JWT_SECRET || "superKeyForJWT"
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days

export interface User {
  id: string
  email: string
  name?: string
  created_at: Date
  email_verified: boolean
}

export interface Session {
  id: string
  user_id: string
  token: string
  expires_at: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name?: string): Promise<User> {
  const passwordHash = await hashPassword(password)

  const result = await sql`
    INSERT INTO users (email, password_hash, name)
    VALUES (${email}, ${passwordHash}, ${name})
    RETURNING id, email, name, created_at, email_verified
  `

  return result[0] as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, created_at, email_verified
    FROM users 
    WHERE email = ${email}
  `

  return (result[0] as User) || null
}

export async function getUserById(id: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, created_at, email_verified
    FROM users 
    WHERE id = ${id}
  `

  return (result[0] as User) || null
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await sql`
    SELECT id, email, name, password_hash, created_at, email_verified
    FROM users 
    WHERE email = ${email}
  `

  const user = result[0]
  if (!user) return null

  const isValid = await verifyPassword(password, user.password_hash)
  if (!isValid) return null

  // Update last login
  await sql`
    UPDATE users 
    SET last_login = NOW() 
    WHERE id = ${user.id}
  `

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    created_at: user.created_at,
    email_verified: user.email_verified,
  }
}

export async function createSession(userId: string): Promise<string> {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" })
  const expiresAt = new Date(Date.now() + SESSION_DURATION)

  await sql`
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt})
  `

  return token
}

export async function getSessionUser(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    // Check if session exists and is not expired
    const sessionResult = await sql`
      SELECT s.id as session_id, s.expires_at, u.id, u.email, u.name, u.created_at, u.email_verified
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ${token} AND s.expires_at > NOW()
    `
    
    if (!sessionResult[0]) {
      return null
    }

    // Update last accessed
    await sql`
      UPDATE sessions 
      SET last_accessed = NOW() 
      WHERE token = ${token}
    `

    const session = sessionResult[0]
    return {
      id: session.id,
      email: session.email,
      name: session.name,
      created_at: session.created_at,
      email_verified: session.email_verified,
    }
  } catch (error) {
    return null
  }
}

export async function deleteSession(token: string): Promise<void> {
  await sql`
    DELETE FROM sessions 
    WHERE token = ${token}
  `
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  return getSessionUser(token)
}

export function setAuthCookie(token: string) {
  const cookieStore = cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  })
}

export function clearAuthCookie() {
  const cookieStore = cookies()
  cookieStore.delete("auth-token")
}

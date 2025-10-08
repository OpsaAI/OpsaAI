import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

interface CollaborationSession {
  id: string
  name: string
  description?: string
  owner_id: string
  participants: string[]
  files: Array<{
    name: string
    content: string
    type: string
    uploaded_by: string
    uploaded_at: string
  }>
  analysis_results: {
    chat_history: any[]
    analysis_results: any
    visualization_data: any
    log_analysis: any
  }
  created_at: string
  updated_at: string
  status: "active" | "archived" | "deleted"
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { action, ...data } = await request.json()

    switch (action) {
      case "create_session":
        return await createCollaborationSession(user.id, data)
      case "join_session":
        return await joinCollaborationSession(user.id, data.sessionId)
      case "update_session":
        return await updateCollaborationSession(user.id, data)
      case "get_session":
        return await getCollaborationSession(user.id, data.sessionId)
      case "list_sessions":
        return await listCollaborationSessions(user.id)
      case "share_file":
        return await shareFile(user.id, data)
      case "update_analysis":
        return await updateAnalysis(user.id, data)
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Error in /api/collaboration:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function createCollaborationSession(userId: string, data: any) {
  const { name, description, participants = [] } = data

  if (!name) {
    return NextResponse.json({ error: "Session name is required" }, { status: 400 })
  }

  try {
    const result = await sql`
      INSERT INTO collaboration_sessions (name, description, owner_id, participants, created_at, updated_at, status)
      VALUES (${name}, ${description || ""}, ${userId}, ${JSON.stringify([userId, ...participants])}, NOW(), NOW(), 'active')
      RETURNING id, name, description, owner_id, participants, created_at, updated_at, status
    `

    return NextResponse.json({
      session: result[0],
      message: "Collaboration session created successfully"
    })
  } catch (error) {
    console.error("Error creating collaboration session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}

async function joinCollaborationSession(userId: string, sessionId: string) {
  try {
    // Check if session exists and user has permission
    const session = await sql`
      SELECT * FROM collaboration_sessions 
      WHERE id = ${sessionId} AND status = 'active'
    `

    if (!session[0]) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    const currentParticipants = session[0].participants || []
    if (!currentParticipants.includes(userId)) {
      // Add user to participants
      const updatedParticipants = [...currentParticipants, userId]
      await sql`
        UPDATE collaboration_sessions 
        SET participants = ${JSON.stringify(updatedParticipants)}, updated_at = NOW()
        WHERE id = ${sessionId}
      `
    }

    return NextResponse.json({
      session: session[0],
      message: "Successfully joined collaboration session"
    })
  } catch (error) {
    console.error("Error joining collaboration session:", error)
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 })
  }
}

async function updateCollaborationSession(userId: string, data: any) {
  const { sessionId, updates } = data

  try {
    // Check if user is owner or participant
    const session = await sql`
      SELECT * FROM collaboration_sessions 
      WHERE id = ${sessionId} AND (owner_id = ${userId} OR participants @> ${JSON.stringify([userId])})
    `

    if (!session[0]) {
      return NextResponse.json({ error: "Session not found or access denied" }, { status: 404 })
    }

    // Update session
    const updateFields = []
    const updateValues = []

    if (updates.name) {
      updateFields.push("name = $" + (updateFields.length + 1))
      updateValues.push(updates.name)
    }
    if (updates.description !== undefined) {
      updateFields.push("description = $" + (updateFields.length + 1))
      updateValues.push(updates.description)
    }
    if (updates.participants) {
      updateFields.push("participants = $" + (updateFields.length + 1))
      updateValues.push(JSON.stringify(updates.participants))
    }

    updateFields.push("updated_at = NOW()")
    updateValues.push(sessionId)

    if (updateFields.length > 1) {
      await sql`
        UPDATE collaboration_sessions 
        SET ${sql(updateFields.join(", "))}
        WHERE id = ${sessionId}
      `
    }

    return NextResponse.json({
      message: "Session updated successfully"
    })
  } catch (error) {
    console.error("Error updating collaboration session:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}

async function getCollaborationSession(userId: string, sessionId: string) {
  try {
    const session = await sql`
      SELECT * FROM collaboration_sessions 
      WHERE id = ${sessionId} AND (owner_id = ${userId} OR participants @> ${JSON.stringify([userId])})
    `

    if (!session[0]) {
      return NextResponse.json({ error: "Session not found or access denied" }, { status: 404 })
    }

    return NextResponse.json({
      session: session[0]
    })
  } catch (error) {
    console.error("Error getting collaboration session:", error)
    return NextResponse.json({ error: "Failed to get session" }, { status: 500 })
  }
}

async function listCollaborationSessions(userId: string) {
  try {
    const sessions = await sql`
      SELECT * FROM collaboration_sessions 
      WHERE (owner_id = ${userId} OR participants @> ${JSON.stringify([userId])}) 
      AND status = 'active'
      ORDER BY updated_at DESC
    `

    return NextResponse.json({
      sessions: sessions
    })
  } catch (error) {
    console.error("Error listing collaboration sessions:", error)
    return NextResponse.json({ error: "Failed to list sessions" }, { status: 500 })
  }
}

async function shareFile(userId: string, data: any) {
  const { sessionId, file } = data

  try {
    // Check if user has access to session
    const session = await sql`
      SELECT * FROM collaboration_sessions 
      WHERE id = ${sessionId} AND (owner_id = ${userId} OR participants @> ${JSON.stringify([userId])})
    `

    if (!session[0]) {
      return NextResponse.json({ error: "Session not found or access denied" }, { status: 404 })
    }

    // Add file to session
    const currentFiles = session[0].files || []
    const newFile = {
      ...file,
      uploaded_by: userId,
      uploaded_at: new Date().toISOString()
    }

    const updatedFiles = [...currentFiles, newFile]

    await sql`
      UPDATE collaboration_sessions 
      SET files = ${JSON.stringify(updatedFiles)}, updated_at = NOW()
      WHERE id = ${sessionId}
    `

    return NextResponse.json({
      message: "File shared successfully",
      file: newFile
    })
  } catch (error) {
    console.error("Error sharing file:", error)
    return NextResponse.json({ error: "Failed to share file" }, { status: 500 })
  }
}

async function updateAnalysis(userId: string, data: any) {
  const { sessionId, analysisType, results } = data

  try {
    // Check if user has access to session
    const session = await sql`
      SELECT * FROM collaboration_sessions 
      WHERE id = ${sessionId} AND (owner_id = ${userId} OR participants @> ${JSON.stringify([userId])})
    `

    if (!session[0]) {
      return NextResponse.json({ error: "Session not found or access denied" }, { status: 404 })
    }

    // Update analysis results
    const currentAnalysis = session[0].analysis_results || {}
    const updatedAnalysis = {
      ...currentAnalysis,
      [analysisType]: results,
      last_updated_by: userId,
      last_updated_at: new Date().toISOString()
    }

    await sql`
      UPDATE collaboration_sessions 
      SET analysis_results = ${JSON.stringify(updatedAnalysis)}, updated_at = NOW()
      WHERE id = ${sessionId}
    `

    return NextResponse.json({
      message: "Analysis updated successfully",
      analysis: updatedAnalysis
    })
  } catch (error) {
    console.error("Error updating analysis:", error)
    return NextResponse.json({ error: "Failed to update analysis" }, { status: 500 })
  }
}

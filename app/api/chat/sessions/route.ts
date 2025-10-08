import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for chat sessions
// In production, you'd use a database
declare global {
  var chatSessions: Map<string, any>;
}

if (!global.chatSessions) {
  global.chatSessions = new Map();
}

const chatSessions = global.chatSessions;

export async function GET() {
  try {
    const sessions = Array.from(chatSessions.values()).map(session => ({
      id: session.id,
      name: session.name,
      timestamp: session.timestamp,
      messageCount: session.messages?.length || 0,
    })).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ sessions });
  } catch (error) {
    console.error('Error fetching chat sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chat sessions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, messages, files } = await request.json();
    
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const session = {
      id: sessionId,
      name: name || 'New Chat',
      messages: messages || [],
      files: files || [],
      timestamp: new Date().toISOString(),
    };
    
    chatSessions.set(sessionId, session);
    
    return NextResponse.json({ 
      success: true, 
      sessionId,
      session 
    });
  } catch (error) {
    console.error('Error creating chat session:', error);
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    );
  }
}
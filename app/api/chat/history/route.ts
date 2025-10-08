import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for chat sessions
declare global {
  var chatSessions: Map<string, any>;
}

if (!global.chatSessions) {
  global.chatSessions = new Map();
}

const chatSessions = global.chatSessions;

export async function POST(request: NextRequest) {
  try {
    const { sessionId, sessionName, messages, files } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Get existing session or create new one
    let session = chatSessions.get(sessionId);
    
    if (!session) {
      session = {
        id: sessionId,
        name: sessionName || 'New Chat',
        messages: [],
        files: [],
        timestamp: new Date().toISOString(),
      };
    }
    
    // Update session with new data
    session.name = sessionName || session.name;
    session.messages = messages || session.messages;
    session.files = files || session.files;
    session.lastUpdated = new Date().toISOString();
    
    chatSessions.set(sessionId, session);
    
    return NextResponse.json({ 
      success: true,
      session 
    });
  } catch (error) {
    console.error('Error saving chat history:', error);
    return NextResponse.json(
      { error: 'Failed to save chat history' },
      { status: 500 }
    );
  }
}
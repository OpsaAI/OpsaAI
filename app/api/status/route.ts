import { NextRequest, NextResponse } from 'next/server';
import { Ollama } from 'ollama';

// Initialize Ollama client
const ollama = new Ollama({
  host: 'http://localhost:11434',
});

export async function GET(request: NextRequest) {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      services: {
        vectorDb: 'unknown',
        ollama: 'unknown',
      },
      stats: {
        totalChunks: 0,
        files: [],
      },
      warning: undefined as string | undefined,
    };
    
    // Check vector database status (simplified for now)
    try {
      // For now, just mark as connected since we're using in-memory storage
      status.services.vectorDb = 'connected';
      status.stats = {
        totalChunks: 0,
        files: [],
      };
    } catch (error) {
      status.services.vectorDb = 'error';
      console.error('Vector DB error:', error);
    }
    
    // Check Ollama status
    try {
      const models = await ollama.list();
      status.services.ollama = 'connected';
      
      // Check if llama3 model is available
      const hasLlama3 = models.models.some(model => 
        model.name.includes('llama3') || model.name.includes('llama:3')
      );
      
      if (!hasLlama3) {
        status.services.ollama = 'warning';
        status.warning = 'llama3 model not found. Please install it with: ollama pull llama3';
      }
    } catch (error) {
      status.services.ollama = 'error';
      console.error('Ollama error:', error);
    }
    
    const isHealthy = status.services.vectorDb === 'connected' && 
                     (status.services.ollama === 'connected' || status.services.ollama === 'warning');
    
    return NextResponse.json(status, {
      status: isHealthy ? 200 : 503,
    });
    
  } catch (error) {
    console.error('Status check error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to check service status',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

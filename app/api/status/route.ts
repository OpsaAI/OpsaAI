import { NextRequest, NextResponse } from 'next/server';
import { appConfig } from '@/lib/config';
import { aiService } from '@/lib/ai';

// Get AI provider info
const aiInfo = aiService.getProviderInfo();

export async function GET(request: NextRequest) {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      services: {
        vectorDb: 'connected',
        ai: aiInfo.provider,
        aiAvailable: aiInfo.isAvailable,
        isMock: aiInfo.isMock,
      },
      stats: {
        totalChunks: 0,
        files: [],
      },
      warning: undefined as string | undefined,
      environment: {
        isProduction: appConfig.isProduction,
        isVercel: appConfig.isVercel,
        isLocal: appConfig.isLocal,
      },
    };
    
    // Add AI provider specific status
    if (aiInfo.isMock) {
      status.warning = 'Running in demo mode. For full AI features, configure Hugging Face API or run locally with Ollama.';
    }
    
    const isHealthy = status.services.vectorDb === 'connected';
    
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

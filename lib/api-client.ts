/**
 * API client for OpsaAI backend services
 */

export interface UploadResponse {
  success: boolean;
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  chunksCount: number;
  message: string;
}

export interface ChatResponse {
  success: boolean;
  answer: string;
  chunksUsed: number;
  context: Array<{
    text: string;
    chunkIndex: number;
  }>;
}

export interface StatusResponse {
  timestamp: string;
  services: {
    vectorDb: 'connected' | 'error' | 'unknown';
    ollama: 'connected' | 'error' | 'warning' | 'unknown';
  };
  stats: {
    totalChunks: number;
    files: string[];
  };
  warning?: string;
}

/**
 * Upload a file to the backend
 */
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Upload failed');
  }
  
  return response.json();
}

/**
 * Send a chat message
 */
export async function sendChatMessage(fileId: string, question: string): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileId,
      question,
    }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Chat request failed');
  }
  
  return response.json();
}

/**
 * Check service status
 */
export async function checkStatus(): Promise<StatusResponse> {
  const response = await fetch('/api/status');
  
  if (!response.ok) {
    throw new Error('Status check failed');
  }
  
  return response.json();
}

/**
 * Example usage in a React component
 */
export const useOpsaAI = () => {
  const uploadFileHandler = async (file: File) => {
    try {
      const result = await uploadFile(file);
      console.log('File uploaded:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };
  
  const askQuestion = async (fileId: string, question: string) => {
    try {
      const result = await sendChatMessage(fileId, question);
      console.log('Chat response:', result);
      return result;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  };
  
  const checkServices = async () => {
    try {
      const status = await checkStatus();
      console.log('Service status:', status);
      return status;
    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  };
  
  return {
    uploadFile: uploadFileHandler,
    askQuestion,
    checkServices,
  };
};

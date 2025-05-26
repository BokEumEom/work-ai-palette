
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export class GeminiService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string, agentContext?: any): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Gemini API 키가 필요합니다.');
    }

    const systemPrompt = agentContext 
      ? `당신은 "${agentContext.name}"입니다. 목적: ${agentContext.purpose}. 대상 사용자: ${agentContext.targetUser}. 스타일: ${agentContext.tone}. 이 설정에 맞춰 응답해주세요.`
      : '';

    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n사용자 질문: ${prompt}` : prompt;

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API 오류: ${response.status}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('유효하지 않은 응답 형식');
      }
    } catch (error) {
      console.error('Gemini API 호출 오류:', error);
      throw error;
    }
  }
}

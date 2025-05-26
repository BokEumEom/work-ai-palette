
export class ApiKeyManager {
  private static readonly STORAGE_KEY = 'gemini_api_key';

  static saveApiKey(apiKey: string): void {
    localStorage.setItem(this.STORAGE_KEY, apiKey);
  }

  static getApiKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  static removeApiKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static hasApiKey(): boolean {
    return !!this.getApiKey();
  }

  static validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith('AIza') && apiKey.length > 20;
  }
}

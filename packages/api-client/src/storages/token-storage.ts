type TokenListener = () => void;

class TokenStorage {
  private accessToken: string | null = null;
  private initialized = false;
  private listeners: Set<TokenListener> = new Set();

  setTokens(accessToken: string) {
    this.accessToken = accessToken;
    this.initialized = true;
    this.notify();
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clear() {
    this.accessToken = null;
    this.initialized = true;
    this.notify();
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  setInitialized(value: boolean) {
    this.initialized = value;
    this.notify();
  }

  subscribe(listener: TokenListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

const tokenStore = new TokenStorage();

export default tokenStore;

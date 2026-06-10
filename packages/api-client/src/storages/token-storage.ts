class TokenStorage {
  private accessToken: string | null = null;

  setTokens(accessToken: string) {
    this.accessToken = accessToken;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  clear() {
    this.accessToken = null;
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }
}

const tokenStore = new TokenStorage();

export default tokenStore;

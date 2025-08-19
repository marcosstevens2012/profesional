// Type extensions for Express Request
declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      user?: {
        sub: string;
        email: string;
        name: string;
        roles: string[];
      };
    }
  }
}

export {};

import { User } from "./model/user"; // Adjust the path

declare module 'express-session' {
  interface SessionData {
    user: User | null;
  }
}

declare global {
  namespace Express {
    interface Request {
      session: session.Session & Partial<session.SessionData>;
    }
  }
}

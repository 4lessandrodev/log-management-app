import { Log } from "ts-logs";

export {}

declare global {
  namespace Express {
    export interface Request {
      log: Log;
    }
  }
}
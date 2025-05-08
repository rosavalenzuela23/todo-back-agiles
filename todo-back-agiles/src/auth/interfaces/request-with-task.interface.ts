import { Request } from 'express';

export interface TaskUser {
  userId?: string;
  email?: string;
}

export interface RequestWithTaskUser extends Request {
  user: TaskUser;
}

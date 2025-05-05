import { Request } from 'express';

export interface RequestWithTaskUser extends Request {
  user: {
    email: string;
  };
}

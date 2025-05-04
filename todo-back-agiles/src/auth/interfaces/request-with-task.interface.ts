import { Request } from 'express';

export interface RequestWithTaskUser extends Request {
  user: {
    _id: string; 
    email?: string;
  };
}

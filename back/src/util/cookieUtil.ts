
import { Response } from 'express';

interface CookieOptions {
  maxAge?: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
  domain?: string;
  path?: string;
}

const setCookie = (
  res: Response, 
  name: string, 
  value: string, 
  options: CookieOptions = {}
) => {
  res.cookie(name, value, {
    maxAge: options.maxAge || +process.env.JWT_EXPIRES_ACCESS, 
    httpOnly: options.httpOnly !== undefined ? options.httpOnly : true,
    secure: options.secure !== undefined ? options.secure : true,
    sameSite: options.sameSite || 'none',
    domain: options.domain || process.env.BACK_DOMAIN, 
    path: options.path || '/', 
  });
};

export default setCookie
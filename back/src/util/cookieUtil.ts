
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
  
  const cookieOptions:CookieOptions = {
    maxAge: +process.env.JWT_EXPIRES_REFRESH,
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: process.env.COOKIE_SAMESITE as CookieOptions['sameSite'],
    domain:process.env.COOKIE_DOMAIN
  }
  if (cookieOptions.domain === 'undefined') {
    delete cookieOptions.domain;
  }

  console.log(cookieOptions)

  res.cookie(name, value, cookieOptions);
};

export default setCookie
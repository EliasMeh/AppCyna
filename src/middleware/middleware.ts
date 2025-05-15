import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  // Log all cookies for debugging
  console.log('🍪 All cookies:', req.cookies.getAll());
  console.log('🔒 Middleware executing for:', req.nextUrl.pathname);

  if (!SECRET_KEY) {
    console.error('⚠️ JWT_SECRET is not set!');
    return NextResponse.redirect(new URL('/', req.url));
  }

  const token = req.cookies.get('token')?.value;
  console.log('🔑 Raw token value:', token);

  if (!token) {
    console.log('❌ No token found, redirecting to login');
    return NextResponse.redirect(new URL('/users/connexion', req.url));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    console.log('🎯 Decoded token:', {
      userId: decoded.userId,
      role: decoded.role,
      exp: decoded.exp
        ? new Date(decoded.exp * 1000).toISOString()
        : 'no expiration',
    });

    // Add user info to request headers for downstream use
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decoded.userId.toString());
    requestHeaders.set('x-user-role', decoded.role);

    // Check admin access for backoffice
    if (req.nextUrl.pathname.startsWith('/pages/backoffice')) {
      if (decoded.role !== 'ADMIN') {
        console.log('🚫 Non-admin access attempt to backoffice');
        return NextResponse.redirect(new URL('/', req.url));
      }
      console.log('✅ Admin access granted to backoffice');
    }

    return NextResponse.next({
      headers: requestHeaders,
    });
  } catch (error) {
    console.error('🔒 JWT verification failed:', error);
    // Clear the invalid token
    const response = NextResponse.redirect(
      new URL('/users/connexion', req.url)
    );
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/pages/backoffice',
    '/pages/backoffice/:path*',
    '/api/users/me',
    '/api/protected/:path*',
  ],
};

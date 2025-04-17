import { NextRequest, NextResponse } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(req: NextRequest) {
  console.log('Middleware called for path:', req.nextUrl.pathname);

  if (!SECRET_KEY) {
    console.error('JWT_SECRET is not set!');
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const token = req.cookies.get('token')?.value;
  console.log('Token present:', !!token);

  if (!token) {
    console.log('No token found, redirecting to login');
    return NextResponse.redirect(new URL('/api/users/connexion', req.url));
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
    console.log('Decoded token:', decoded);

    if (req.nextUrl.pathname.startsWith('/pages/backoffice')) {
      console.log('Checking admin access, user role:', decoded.role);
      if (decoded.role !== 'ADMIN') {
        console.log('Non-admin user attempted to access backoffice');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return NextResponse.redirect(new URL('/api/users/connexion', req.url));
  }
}

export const config = {
  matcher: ['/pages/backoffice/*'],
};

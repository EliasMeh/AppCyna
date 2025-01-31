import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    try {
        if (token) {
            jwt.verify(token, SECRET_KEY) as JwtPayload;
            return NextResponse.next(); // Allow access
        } else {
            return NextResponse.redirect(new URL("/api/users/connexion", req.url)); // Redirect if not authenticated
        }
    } catch {
        return NextResponse.redirect(new URL("/api/users/connexion", req.url)); // Redirect if not authenticated
    }
}

// Apply to protected routes
export const config = {
    matcher: ["/pages/cart", "/pages/checkout"], // Protect these pages
};

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export function middleware(req: any) {
    const token = req.cookies.get("token")?.value;

    try {
        jwt.verify(token, SECRET_KEY);
        return NextResponse.next(); // Allow access
    } catch {
        return NextResponse.redirect(new URL("/api/users/connexion", req.url)); // Redirect if not authenticated
    }
}

// Apply to protected routes
export const config = {
    matcher: ["/pages/cart", "/pages/checkout"], // Protect these pages
};

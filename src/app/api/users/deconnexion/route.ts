import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json({ message: "Logout successful" });
    response.headers.set("Set-Cookie", "token=; HttpOnly; Secure; Path=/; Max-Age=0");
    return response;
}

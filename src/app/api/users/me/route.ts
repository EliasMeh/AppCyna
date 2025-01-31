import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        const user = await prisma.user.findUnique({ where: { id: decoded.userId }, select: { id: true, email: true, nom: true, prenom: true } });

        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
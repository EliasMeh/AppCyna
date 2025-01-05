import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const produitid = Number(url.pathname.split("/").pop());

    const data = await prisma.produit.findFirst({
        where: { id: produitid },
    });

    return NextResponse.json(data);
}
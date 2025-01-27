import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const url = new URL(request.url);
    const categorieId = Number(url.pathname.split("/").pop());

    const data = await prisma.categorie.findFirst({
        where: { id: categorieId },
        include : {
            produits: true
        }
    });

    return NextResponse.json(data);
}
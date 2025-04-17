import { PrismaClient, ImageType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

const getMimeType = (fileType: string): ImageType => {
  switch (fileType.toLowerCase()) {
    case 'image/jpeg':
    case 'image/jpg':
      return 'JPEG';
    case 'image/png':
      return 'PNG';
    case 'image/webp':
      return 'WEBP';
    case 'image/gif':
      return 'GIF';
    case 'image/svg+xml':
      return 'SVG';
    default:
      return 'JPEG';
  }
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const title = formData.get('title')?.toString() || '';
    const orderValue = formData.get('order')?.toString() || '0';
    const order = parseInt(orderValue);

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          error: 'No image file provided',
        },
        { status: 400 }
      );
    }

    if (isNaN(order) || order < 0 || order > 2) {
      return NextResponse.json(
        {
          error: 'Invalid order value. Must be between 0 and 2',
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const imageType = getMimeType(file.type);

    const existingImage = await prisma.carouselImage.findFirst({
      where: { order },
    });

    let carouselImage;

    if (existingImage) {
      carouselImage = await prisma.carouselImage.update({
        where: { id: existingImage.id },
        data: {
          data: buffer,
          title,
          active: true,
          contentType: imageType,
        },
      });
    } else {
      carouselImage = await prisma.carouselImage.create({
        data: {
          data: buffer,
          title,
          order,
          active: true,
          contentType: imageType,
        },
      });
    }

    return NextResponse.json({
      success: true,
      image: {
        id: carouselImage.id,
        title: carouselImage.title,
        order: carouselImage.order,
        contentType: imageType,
      },
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to upload image',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const images = await prisma.carouselImage.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(
      images.map((img) => ({
        ...img,
        data: {
          type: 'Buffer',
          data: Array.from(img.data), // Convert Buffer to array explicitly
        },
      }))
    );
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch carousel images',
      },
      { status: 500 }
    );
  }
}

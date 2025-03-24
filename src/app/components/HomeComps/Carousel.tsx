'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageType } from '@prisma/client';

interface CarouselImage {
  id: number;
  data: {
    type: 'Buffer';
    data: number[];
  };
  title?: string;
  order: number;
  contentType: ImageType;
}

export default function Carousel() {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCarouselImages();
  }, []);

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  const fetchCarouselImages = async () => {
    try {
      const response = await fetch('/api/carousel');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      } else {
        console.error('Failed to fetch images:', await response.text());
      }
    } catch (error) {
      console.error('Failed to fetch carousel images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMimeType = (contentType: ImageType): string => {
    switch (contentType) {
      case 'JPEG':
        return 'image/jpeg';
      case 'PNG':
        return 'image/png';
      case 'WEBP':
        return 'image/webp';
      case 'GIF':
        return 'image/gif';
      case 'SVG':
        return 'image/svg+xml';
      default:
        return 'image/jpeg';
    }
  };

  const getImageSrc = (imageData: CarouselImage['data'], contentType: ImageType) => {
    if (!imageData?.data) return null;

    try {
        // Convert to Uint8Array if it's not already
        const byteArray = imageData.data instanceof Uint8Array
            ? imageData.data
            : new Uint8Array(imageData.data);

        const binaryString = Array.from(byteArray)
            .map(b => String.fromCharCode(b))
            .join('');
        
        return `data:${getMimeType(contentType)};base64,${btoa(binaryString)}`;
    } catch (error) {
        console.error('Conversion error:', error);
        return null;
    }
  };

  if (isLoading) {
    return <div className="relative w-full h-[400px] bg-gray-200 animate-pulse rounded-lg" />;
  }

  if (images.length === 0) {
    return (
      <div className="relative w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-gray-100">
      {images.map((image, index) => {
        const imageSrc = getImageSrc(image.data, image.contentType);
        if (!imageSrc) {
          console.warn(`Failed to generate source for image ${image.id}`);
          return null;
        }

        return (
          <div
            key={image.id}
            className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
              index === currentIndex ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <Image
              src={imageSrc}
              alt={image.title || `Carousel image ${index + 1}`}
              fill
              style={{ objectFit: 'cover' }}
              priority={index === currentIndex}
              className="z-20 select-none"
              sizes="100vw"
              unoptimized // This line is crucial
              onError={(e) => console.error("Image load error:", image.id, e)}
            />
          </div>
        );
      })}

      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
        {images.map((_, index) => {
          const isActive = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
              }}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                isActive ? 'bg-white' : 'bg-white/50'
              } hover:bg-white/75 shadow-md`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            />
          );
        })}
      </div>
    </div>
  );
}

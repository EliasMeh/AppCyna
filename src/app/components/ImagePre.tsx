'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageProps {
  id: string;
  alt: string;
}

const ImagePre = ({ id, alt }: ImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>('/assets/nuage.png');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchImage() {
      if (!id) return;

      try {
        console.log('Fetching image for product:', id);
        const response = await fetch(`/api/image/${id}`);

        if (!response.ok) {
          console.error('Failed to fetch image:', response.status);
          return;
        }

        const images = await response.json();

        // Check if we got any images back
        if (images && images.length > 0 && images[0].data) {
          // The data is already base64 encoded from the API
          const imageUrl = `data:image/png;base64,${images[0].data}`;
          setImageSrc(imageUrl);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        setImageSrc('/assets/nuage.png');
      } finally {
        setIsLoading(false);
      }
    }

    fetchImage();
  }, [id]);

  return (
    <div className="relative h-full w-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-customViolet border-t-transparent" />
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt || 'Product Image'}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain"
        priority
        unoptimized
        onError={() => {
          console.error('Error rendering image:', id);
          setImageSrc('/assets/nuage.png');
        }}
      />
    </div>
  );
};

export default ImagePre;

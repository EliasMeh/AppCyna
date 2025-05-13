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
          const imageData = images[0].data;
          const buffer = Buffer.from(imageData);
          const base64String = buffer.toString('base64');
          const imageUrl = `data:image/png;base64,${base64String}`;
          setImageSrc(imageUrl);
        }
      } catch (error) {
        console.error('Error loading image:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchImage();
  }, [id]);

  return (
    <div className="relative w-[200px] h-[200px]">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-customViolet rounded-full border-t-transparent" />
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt || "Product Image"}
        width={200}
        height={200}
        className="object-cover w-full h-full"
        unoptimized
        priority
        onError={() => {
          console.error('Error rendering image:', id);
          setImageSrc('/assets/nuage.png');
        }}
      />
    </div>
  );
};

export default ImagePre;

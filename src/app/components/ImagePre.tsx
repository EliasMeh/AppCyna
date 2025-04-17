'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface ImageProps {
  id: string;
  alt: string;
}

const MyImageComponent = ({ id }: ImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>('/assets/nuage.png'); // Set default image

  useEffect(() => {
    async function fetchImage() {
      try {
        const response = await fetch(`/api/image/presentation/${id}`);
        if (!response.ok) {
          return; // Keep default image
        }
        const data = await response.json();
        console.log('Raw response data:', data);

        if (data && data.data) {
          const byteArray = Object.values(data.data) as number[];
          const uint8Array = new Uint8Array(byteArray);
          const base64String = btoa(
            String.fromCharCode.apply(null, Array.from(uint8Array))
          );
          const imageUrl = `data:image/png;base64,${base64String}`;
          console.log('Created image URL:', imageUrl.substring(0, 50) + '...');
          setImageSrc(imageUrl);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        // Keep default image on error
      }
    }

    fetchImage();
  }, [id]);

  return (
    <div>
      <Image
        src={imageSrc}
        alt="Fetched Image"
        width={200}
        height={200}
        unoptimized
        onError={(e) => {
          console.error('Error rendering image:', e);
          setImageSrc('/assets/nuage.png'); // Set fallback on image load error
        }}
        onLoad={() => console.log('Image rendered successfully')}
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default MyImageComponent;

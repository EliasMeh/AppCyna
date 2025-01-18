'use client'
import React, { useEffect, useState } from 'react'

interface ImageProps {
    id: string;
}

const Image = ({ id }: ImageProps) => {
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await fetch(`http://localhost:3000/api/image/presentation/${id}`);
                const data = await response.json();
                console.log('Fetched data:', data); // Log the response data for debugging
                if (data && data.data) {
                    // Decode base64 data and create a data URL
                    const base64String = Buffer.from(data.data, 'base64').toString('base64');
                    const imageUrl = `data:image/jpeg;base64,${base64String}`;
                    setImageSrc(imageUrl);
                }
            } catch (error) {
                console.log('Erreur lors de la récupération de l\'image', error);
            }
        }

        fetchImage();
    }, [id]);

    return (
        <div>
            {imageSrc ? <img src={imageSrc} alt="Fetched Image" /> : <p>Loading...</p>}
        </div>
    )
}

export default Image
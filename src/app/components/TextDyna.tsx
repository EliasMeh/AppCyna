'use client';
import React, { useEffect, useState } from 'react';

const TextDyna = () => {
  const [textaffichable, setTextaffichable] = useState('Loading...');

  useEffect(() => {
    async function fetchText() {
      try {
        const response = await fetch('/api/text');
        const data = await response.json();
        setTextaffichable(data.content);
      } catch (error) {
        setTextaffichable('Erreur lors de la récupération du texte');
      }
    }

    fetchText();
  }, []);

  return (
    <div className="border-spacing-5 rounded-lg border-2 border-gray-300 p-5">
      <h2 className="text-center">{textaffichable}</h2>
    </div>
  );
};

export default TextDyna;

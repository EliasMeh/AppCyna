'use client';
import React, { useEffect, useState } from 'react';

const TextDyna = () => {
  const [textaffichable, setTextaffichable] = useState('Loading...');

  useEffect(() => {
    async function fetchText() {
      try {
        const response = await fetch('http://localhost:3000/api/text');
        const data = await response.json();
        setTextaffichable(data.content);
      } catch (error) {
        setTextaffichable('Erreur lors de la récupération du texte');
      }
    }

    fetchText();
  }, []);

  return (
    <div>{textaffichable}</div>
  );
}

export default TextDyna;
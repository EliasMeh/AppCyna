'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const Deco = () => {
  const router = useRouter();

  const handleFallback = () => {
    router.push('/');
  };

  return (
    <button
      onClick={handleFallback}
      className="rounded-lg bg-customViolet p-2 text-white"
    >
      Main Page
    </button>
  );
};

export default Deco;

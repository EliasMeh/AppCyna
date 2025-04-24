'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear cart after successful payment
    localStorage.removeItem('guestCart');
    
    // Redirect to home after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/');
    }, 5000);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <main>
      <Header />
      <div className="container mx-auto p-4">
        <div className="my-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-green-600">
            Payment Successful!
          </h1>
          <p className="mb-8 text-gray-600">
            Thank you for your subscription. You will be redirected to the homepage
            shortly.
          </p>
          <button
            onClick={() => router.push('/')}
            className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
      <Footer />
    </main>
  );
}
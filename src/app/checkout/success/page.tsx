'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';

interface CheckoutStatus {
  status: string;
  message: string;
}

export default function SuccessPage() {
  const [status, setStatus] = useState<CheckoutStatus>({ 
    status: 'loading', 
    message: 'Processing your order...' 
  });
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      setStatus({
        status: 'error',
        message: 'Invalid session ID provided'
      });
      return;
    }

    // Verify the checkout session
    const verifyCheckout = async () => {
      try {
        console.log('Verifying session:', sessionId); // Debug log

        const response = await fetch('/api/verify-checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            sessionId: sessionId.toString()
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to verify checkout');
        }

        setStatus({
          status: 'success',
          message: 'Payment successful! Your subscription has been activated.'
        });

        // Clear cart
        localStorage.removeItem('guestCart');

        // Redirect to home after 5 seconds
        setTimeout(() => {
          router.push('/');
        }, 5000);

      } catch (error) {
        console.error('Verification error:', error); // Debug log
        setStatus({
          status: 'error',
          message: error instanceof Error ? error.message : 'Failed to verify payment'
        });
      }
    };

    verifyCheckout();
  }, [sessionId, router]);

  // Fix the cart return path
  const handleCartReturn = () => {
    router.push('/cart'); // Remove '/pages' prefix
  };

  return (
    <main>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <div className="mx-auto max-w-2xl text-center">
          {status.status === 'loading' && (
            <div className="animate-pulse">
              <h1 className="mb-4 text-2xl font-bold">Processing your order...</h1>
              <p className="text-gray-600">Please wait while we confirm your payment.</p>
            </div>
          )}

          {status.status === 'success' && (
            <div className="rounded-lg bg-green-50 p-6">
              <h1 className="mb-4 text-3xl font-bold text-green-600">
                Thank you for your purchase!
              </h1>
              <p className="mb-6 text-gray-600">{status.message}</p>
              <p className="text-sm text-gray-500">
                You will be redirected to the homepage in a few seconds...
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 rounded-md bg-green-600 px-6 py-2 text-white transition-colors hover:bg-green-700"
              >
                Return to Home
              </button>
            </div>
          )}

          {status.status === 'error' && (
            <div className="rounded-lg bg-red-50 p-6">
              <h1 className="mb-4 text-3xl font-bold text-red-600">
                Oops! Something went wrong
              </h1>
              <p className="mb-6 text-gray-600">{status.message}</p>
              <button
                onClick={handleCartReturn}
                className="mt-4 rounded-md bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
              >
                Return to Cart
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
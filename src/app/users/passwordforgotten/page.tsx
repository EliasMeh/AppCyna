'use client';

import React, { useState } from 'react';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';

const PasswordForgottenPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(
          'Un email de réinitialisation a été envoyé à votre adresse.'
        );
      } else {
        setStatus('error');
        setMessage(data.error || 'Une erreur est survenue.');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Une erreur est survenue lors de la demande.');
    }
  };

  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Mot de passe oublié
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Entrez votre email pour réinitialiser votre mot de passe
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="sr-only">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Adresse email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'loading'}
              />
            </div>

            {message && (
              <div
                className={`rounded-md p-4 ${
                  status === 'success'
                    ? 'bg-green-50 text-green-800'
                    : 'bg-red-50 text-red-800'
                }`}
              >
                {message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className={`group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  status === 'loading' ? 'cursor-not-allowed opacity-50' : ''
                }`}
              >
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PasswordForgottenPage;

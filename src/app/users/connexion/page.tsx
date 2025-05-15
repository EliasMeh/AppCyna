'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../communs/Header';
import Footer from '../../communs/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [mdp, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [tempUserId, setTempUserId] = useState<number | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/users/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mdp }),
    });

    const data = await response.json();

    if (response.ok) {
      if (data.requires2FA) {
        setShowTwoFactor(true);
        setTempUserId(data.userId);
      } else {
        localStorage.setItem('user', JSON.stringify(data.user));

        // ✅ AJOUT POUR CORRIGER LE COOKIE
        if (data.token) {
          document.cookie = `token=${data.token}; path=/; max-age=86400`;
        }

        if (data.user.role === 'ADMIN') {
          router.push('/pages/backoffice');
        } else {
          router.push('/');
        }
      }
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const response = await fetch('/api/users/verify2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: tempUserId,
        code: verificationCode,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));

      // ✅ AJOUT ICI AUSSI
      if (data.token) {
        document.cookie = `token=${data.token}; path=/; max-age=86400`;
      }

      router.push('/pages/backoffice');
    }
  };

  return (
    <main>
      <Header />
      <div className="mt-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold">Connexion</h2>
        {error && <p className="text-red-500">{error}</p>}

        {!showTwoFactor ? (
          <form onSubmit={handleSubmit} className="flex flex-col items-center">
            <input
              className="mt-4 rounded border border-gray-300 p-2"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="mt-4 rounded border border-gray-300 p-2"
              type="password"
              placeholder="Mot de passe"
              value={mdp}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="mt-4 rounded bg-blue-500 p-2 text-white"
              type="submit"
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => router.push('/users/passwordforgotten')}
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
            >
              Mot de passe oublié ?
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyCode}
            className="flex flex-col items-center"
          >
            <p className="mb-4 text-center text-sm text-gray-600">
              Un code de vérification a été envoyé à votre numéro de téléphone
            </p>
            <input
              className="mt-4 rounded border border-gray-300 p-2"
              type="text"
              placeholder="Code de vérification"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
              maxLength={6}
            />
            <button
              className="mt-4 rounded bg-blue-500 p-2 text-white"
              type="submit"
            >
              Vérifier
            </button>
          </form>
        )}
      </div>
      <Footer />
    </main>
  );
};

export default LoginPage;

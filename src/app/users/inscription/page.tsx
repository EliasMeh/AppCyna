'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../communs/Header';
import Footer from '../../communs/Footer';

const SignupPage = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [mdp, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/users/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom, prenom, email, mdp }),
      });

      const text = await response.text(); // Read response as text (not JSON yet)
      console.log('Raw response:', text); // Debugging step

      const data = JSON.parse(text); // Manually parse JSON to catch errors

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <main>
      <Header />
      <div className="mt-10 flex flex-col items-center">
        <h2 className="text-2xl font-bold">Inscription</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Nom"
              className="mt-4 rounded border border-gray-300 p-2"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Prénom"
              className="mt-4 rounded border border-gray-300 p-2"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              required
            />
          </div>
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
            className="mt-4 rounded bg-green-500 p-2 text-white"
            type="submit"
          >
            Inscription
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
};

export default SignupPage;

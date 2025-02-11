'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../communs/Header';
import Footer from '../../communs/Footer';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [mdp, setPassword] = useState('');
  const [error, setError] = useState('');
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
      localStorage.setItem('user', JSON.stringify(data.user));
      if(data.user.role == 'ADMIN'){
        router.push('/pages/backoffice');
      }
      else{
        router.push('/'); 
      }
      
    } else {
      setError(data.error);
    }
  };

  return (
    <main>
      <Header />
      <div className="flex flex-col items-center mt-10">
        <h2 className="text-2xl font-bold">Connexion</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <input
            className="mt-4 p-2 border border-gray-300 rounded"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="mt-4 p-2 border border-gray-300 rounded"
            type="password"
            placeholder="Mot de passe"
            value={mdp}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="mt-4 p-2 bg-blue-500 text-white rounded" type="submit">
            Connexion
          </button>
        </form>
      </div>
      <Footer />
    </main>
  );
};

export default LoginPage;

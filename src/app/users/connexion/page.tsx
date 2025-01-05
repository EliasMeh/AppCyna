import React from 'react'
import Header from '../../communs/Header';
import Footer from '../../communs/Footer';

const page = () => {
  return (
    <main>
        <Header />
            <div>Page de connexion</div>
            <form className='flex flex-col items-center'>
                <input className='mt-4' type="text" placeholder="Email" />
                <input className='mt-4' type="password" placeholder="Mot de passe" />
                <button className='mt-4' type="submit">Connexion</button>
                
            </form>

        <Footer />
    </main>
  )
}

export default page
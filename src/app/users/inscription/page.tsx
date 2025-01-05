import React from 'react'
import Header from '../../communs/Header';
import Footer from '../../communs/Footer';

const page = () => {
  return (
    <main>
        <Header />
            <div>Page d'inscription</div>
            <form>
                <div className='flex flex-col items-center'>
                <div>
                    <input type='text' placeholder='Nom' />
                    <input type='text' placeholder='Prénom' /> 
                </div>
                <input className='mt-4' type="text" placeholder="Email" />
                <input className='mt-4' type="password" placeholder="Mot de passe" />
                <button className='mt-4' type="submit">Inscription</button>
                </div>
            </form>
        <Footer />
    </main>
  )
}

export default page
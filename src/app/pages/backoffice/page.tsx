import React from 'react'
import TextInputBack from '@/app/components/backcomp/TextInputBack';
import GrilleModifiable from '@/app/components/backcomp/GrilleModifiable';


const page = () => {


  return (
    <>
      <main>
        <h1>Page d'accueil</h1>
        <div className='flex flex-wrap'>
          <h2 className='pr-3'>Texte dynamique de la page d'accueil : </h2>
          <TextInputBack />  
        </div>
        <div className='flex flex-wrap'>
          <h2 className='pr-3'>Liste des produits : </h2>
          <GrilleModifiable />
        </div>
      </main>
    </>
  );
}

export default page
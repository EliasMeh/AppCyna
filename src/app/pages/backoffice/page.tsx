import React from 'react'
import TextInputBack from '@/app/components/backcomp/TextInputBack';
import GrilleModifiable from '@/app/components/backcomp/GrilleModifiable';
import Deco from '@/app/components/backcomp/Deco';
import { InputFile } from '@/app/components/backcomp/input-file';
import CarouselManager from '@/app/components/backcomp/CarouselManager';

const page = () => {
  return (
    <>
      <main>
        <h1>Page uniquement accessible aux ADMINISTRATEURS</h1>
        <Deco/>
        <div className='flex flex-wrap'>
          <h2 className='pr-3'>Texte dynamique de la page d'accueil : </h2>
          <TextInputBack />  
        </div>
        <div className='flex flex-wrap'>
          <h2 className='pr-3'>Liste des produits : </h2>
          <GrilleModifiable />
        </div>
        <div className='flex flex-wrap'>
          <h2 className='pr-3'>Gestion du Carousel : </h2>
          <CarouselManager />
        </div>
        <div>
          <InputFile />
        </div>
      </main>
    </>
  );
}

export default page
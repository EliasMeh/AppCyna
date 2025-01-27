import Footer from '@/app/communs/Footer'
import Header from '@/app/communs/Header'
import React from 'react'
import Search from '@/app/components/Search'
import { Suspense } from 'react';

const page = () => {
  return (
    <main>
        
        <Header />
        <div className='pl-2'>
        <h1>Recherche</h1>
        <p>Page de recherche</p>
        <Suspense fallback={<div>Loading...</div>}>
            <Search/>
        </Suspense>
        <div className='mt-60'>

        </div>
        </div>
        <Footer />
        
    </main>
  )
}

export default page
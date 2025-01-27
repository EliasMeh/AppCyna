import Footer from '@/app/communs/Footer'
import Header from '@/app/communs/Header'
import React from 'react'
import Search from '@/app/components/Search'

const page = () => {
  return (
    <main>
        <Header />
        <h1>Recherche</h1>
        <p>Page de recherche</p>
        <Search/>
        <Footer />
    </main>
  )
}

export default page
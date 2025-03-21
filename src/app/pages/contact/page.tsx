import Footer from '@/app/communs/Footer'
import Header from '@/app/communs/Header'
import React from 'react'

const ContactPage = () => {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Informations de contact</h2>
        
        <div className="flex gap-4">
          <div className="space-y-4">
            <p className="text-lg "><strong>Contactez nous</strong></p>
            <p>10 rue de Penthièvre
            <br/>75008 Paris
            <br/>+33 1 89 70 14 36
            </p>
          </div>
          
          <div className="space-y-4">
            <h2 className='text-lg'><strong>Bureaux</strong></h2>
            <div>
              <p>
                11 avenue Dubonnet
                <br/>92400 Courbevoie
                <br/>+33 1 89 70 14 36
                <br/>contact@cyna-it.fr
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default ContactPage
import Footer from '@/app/communs/Footer';
import Header from '@/app/communs/Header';
import ContactForm from '@/app/components/ContactForm';
import React from 'react';

const ContactPage = () => {
  return (
    <main className="flex min-h-screen flex-col">
      <Header />

      <div className="container mx-auto flex-grow px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-2xl font-bold">Contact Us</h2>
            <ContactForm />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Main Office</h3>
              <p>
                10 rue de Penthièvre
                <br />
                75008 Paris
                <br />
                +33 1 89 70 14 36
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Branch Office</h3>
              <p>
                11 avenue Dubonnet
                <br />
                92400 Courbevoie
                <br />
                +33 1 89 70 14 36
                <br />
                contact@cyna-it.fr
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
};

export default ContactPage;

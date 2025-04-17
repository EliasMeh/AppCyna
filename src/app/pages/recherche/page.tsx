import React, { Suspense } from 'react';
import Search from '@/app/components/Search';
import Header from '@/app/communs/Header';
import Footer from '@/app/communs/Footer';

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <Search />
      </Suspense>
      <Footer />
    </>
  );
}

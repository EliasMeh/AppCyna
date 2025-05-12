import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import TextInputBack from '@/app/components/backcomp/TextInputBack';
import GrilleModifiable from '@/app/components/backcomp/GrilleModifiable';
import Deco from '@/app/components/backcomp/Deco';
import { InputFile } from '@/app/components/backcomp/input-file';
import CarouselManager from '@/app/components/backcomp/CarouselManager';
import FallbackButton from '@/app/components/backcomp/FallbackButton';
import ModifGrilleCategorie from '@/app/components/backcomp/ModifGrilleCategorie';
import HandleSubUser from '@/app/components/backcomp/HandleSubUser';

export default async function BackofficePage() {
  const cookieStore = await cookies(); // ✅ await ici
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('❌ No token found in cookies – redirecting to /');
    redirect('/');
  }

  try {
    const res = await fetch('http://localhost:3000/api/users/me', {
      headers: {
        Cookie: `token=${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.log('⛔️ Failed to fetch user info');
      redirect('/');
    }

    const data = await res.json();

    if (!data.user || data.user.role !== 'ADMIN') {
      console.log('⛔️ User is not admin:', data.user?.role);
      redirect('/');
    }

    console.log('✅ Admin access granted to:', data.user.email);
  } catch (error) {
    console.error('💥 Error verifying admin:', error);
    redirect('/');
  }

  return (
    <main className="p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Administration Panel</h1>
      <Deco />
      <FallbackButton />
      <div className="flex flex-wrap">
        <h2 className="pr-3">Texte dynamique de la page d'accueil :</h2>
        <TextInputBack />
      </div>
      <div className="flex flex-wrap">
        <h2 className="pr-3">Liste des produits :</h2>
        <GrilleModifiable />
      </div>
      <div className="flex flex-wrap">
        <h2 className="pr-3">Gestion du Carousel :</h2>
        <CarouselManager />
      </div>
      <div>
        <InputFile />
      </div>
      <div>
        <ModifGrilleCategorie />
      </div>
      <h2 className="pr-3">Gestion des abonnements :</h2>
      <div>
        <HandleSubUser />
      </div>
    </main>
  );
}

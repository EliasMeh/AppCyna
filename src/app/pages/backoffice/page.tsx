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
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log('❌ No token found in cookies – redirecting to /');
    redirect('/');
  }

  try {
    const res = await fetch('http://localhost:3000/api/users/me', {
      headers: { Cookie: `token=${token}` },
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
    <main className="p-6 pb-20 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-10">Administration Panel</h1>

      <section className="space-y-4">
        <Deco />
        <FallbackButton />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Texte dynamique de la page d'accueil</h2>
        <TextInputBack />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Liste des produits</h2>
        <GrilleModifiable />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Gestion du Carousel</h2>
        <CarouselManager />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Attribution d'image aux services</h2>
        <InputFile />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Modification de la grille des catégories</h2>
        <ModifGrilleCategorie />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">Gestion des abonnements</h2>
        <HandleSubUser />
      </section>
    </main>
  );
}
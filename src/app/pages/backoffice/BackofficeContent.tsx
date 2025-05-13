'use client';

import TextInputBack from '@/app/components/backcomp/TextInputBack';
import GrilleModifiable from '@/app/components/backcomp/GrilleModifiable';
import Deco from '@/app/components/backcomp/Deco';
import { InputFile } from '@/app/components/backcomp/input-file';
import CarouselManager from '@/app/components/backcomp/CarouselManager';
import FallbackButton from '@/app/components/backcomp/FallbackButton';
import ModifGrilleCategorie from '@/app/components/backcomp/ModifGrilleCategorie';
import HandleSubUser from '@/app/components/backcomp/HandleSubUser';

interface BackofficeContentProps {
  user: {
    email: string;
    role: string;
  };
}

export default function BackofficeContent({ user }: BackofficeContentProps) {
  return (
    <main className="p-6 pb-20 space-y-10">
      <h1 className="text-3xl font-bold text-center mb-10">Administration Panel</h1>

      <section className="space-y-4">
        <Deco />
        <FallbackButton />
      </section>

      <section className="space-y-4 border-t">
        <h2 className="text-2xl font-semibold">Gestion des Textes</h2>
        <TextInputBack />
      </section>

      <section className="space-y-4 border-t">
        <h2 className="text-2xl font-semibold">Gestion des Images</h2>
        <InputFile />
      </section>

      <section className="space-y-4 border-t">
        <h2 className="text-2xl font-semibold">Gestion du Carousel</h2>
        <CarouselManager />
      </section>

      <section className="space-y-4 border-t">
        <h2 className="text-2xl font-semibold">Gestion des Produits</h2>
        <GrilleModifiable />
      </section>

      <section className="space-y-4 border-t">
        <h2 className="text-2xl font-semibold">Gestion des Catégories</h2>
        <ModifGrilleCategorie />
      </section>

      <section className="space-y-4 border-t">
        <h2 className="text-2xl font-semibold">Gestion des Abonnements</h2>
        <HandleSubUser />
      </section>
    </main>
  );
}
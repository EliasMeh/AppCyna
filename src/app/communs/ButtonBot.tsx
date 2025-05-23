'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function ButtonBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 mb-2 w-80 rounded-lg bg-white shadow-xl"
          >
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Chat avec nous
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Comment pouvons-nous vous aider aujourd'hui?
              </p>
              <div className="mt-4 flex flex-col space-y-2">
                <Button
                  onClick={() =>
                    window.open('/pages/contact/chatbot', '_blank')
                  }
                  className="w-full justify-start"
                >
                  🤖 Démarrer le chat
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = '/pages/contact')}
                  className="w-full justify-start text-black"
                >
                  ✉️ Nous contacter
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 rounded-full bg-customViolet p-4 text-white shadow-lg hover:bg-customViolet/90"
        >
          🤖
          <span>{isOpen ? 'Fermer' : "Besoin d'aide ?"}</span>
        </Button>
      </motion.div>
    </div>
  );
}

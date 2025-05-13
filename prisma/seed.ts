import { PrismaClient, Role, ImageType } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function main() {
  try {
    // Clean up existing data
    console.log('Cleaning existing data...')
    await prisma.$transaction([
      prisma.payment.deleteMany(),
      prisma.carouselImage.deleteMany(),
      prisma.image.deleteMany(),
      prisma.text.deleteMany(),
      prisma.previousOrder.deleteMany(),
      prisma.panier.deleteMany(),
      prisma.subscription.deleteMany(),
      prisma.produit.deleteMany(),
      prisma.categorie.deleteMany(),
      prisma.grilleCategorie.deleteMany(),
      prisma.user.deleteMany(),
    ])

    console.log('Creating admin user...')
    const adminPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        mdp: adminPassword,
        nom: 'Admin',
        prenom: 'Super',
        role: Role.ADMIN,
        verified: true,
        phone: '+33669489169', // French mobile number in international format
      },
    })

    console.log('Creating categories...')
    const categories = await Promise.all([
      prisma.categorie.create({ data: { nom: 'Solutions EDR/XDR' } }),
      prisma.categorie.create({ data: { nom: 'Services Managés' } }),
      prisma.categorie.create({ data: { nom: 'Consulting & Audit' } }),
    ])

    console.log('Creating grille categorie...')
    const grilleCategorie = await prisma.grilleCategorie.create({
      data: {
        categorie1Id: categories[0].id,
        categorie2Id: categories[1].id,
        categorie3Id: categories[2].id,
        active: true,
      },
    })

    console.log('Creating products...')
    const products = await Promise.all([
      // EDR/XDR Solutions
      prisma.produit.create({
        data: {
          nom: 'XERI EDR Pro',
          prix: 899.99,
          description: 'Solution EDR avancée avec détection comportementale et réponse automatisée aux incidents',
          quantite: 100,
          placement: 1,
          categorieId: categories[0].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'XERI XDR Enterprise',
          prix: 1499.99,
          description: 'Plateforme XDR complète avec intégration cloud et analyses avancées',
          quantite: 50,
          placement: 2,
          categorieId: categories[0].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'XERI Threat Hunter',
          prix: 1299.99,
          description: 'Solution de hunting des menaces avec IA intégrée',
          quantite: 75,
          placement: 3,
          categorieId: categories[0].id,
        },
      }),

      // Managed Services
      prisma.produit.create({
        data: {
          nom: 'SOC-as-a-Service',
          prix: 2499.99,
          description: 'Centre des opérations de sécurité managé 24/7',
          quantite: 20,
          placement: 4,
          categorieId: categories[1].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'MDR Elite',
          prix: 1899.99,
          description: 'Service de détection et réponse managées premium',
          quantite: 30,
          placement: 5,
          categorieId: categories[1].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'CERT Response',
          prix: 2999.99,
          description: 'Équipe de réponse aux incidents dédiée',
          quantite: 15,
          placement: 6,
          categorieId: categories[1].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'Threat Intel Premium',
          prix: 999.99,
          description: 'Service de renseignement sur les menaces en temps réel',
          quantite: 50,
          placement: 7,
          categorieId: categories[1].id,
        },
      }),

      // Consulting & Audit
      prisma.produit.create({
        data: {
          nom: 'AUDIT 360',
          prix: 4999.99,
          description: 'Audit complet de sécurité avec analyse des vulnérabilités',
          quantite: 10,
          placement: 8,
          categorieId: categories[2].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'PenTest Pro',
          prix: 3499.99,
          description: 'Tests d\'intrusion approfondis avec rapport détaillé',
          quantite: 15,
          placement: 9,
          categorieId: categories[2].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'RedTeam Elite',
          prix: 5999.99,
          description: 'Simulation d\'attaque avancée avec équipe rouge dédiée',
          quantite: 5,
          placement: 10,
          categorieId: categories[2].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'GRC Suite',
          prix: 1999.99,
          description: 'Suite de gouvernance, risque et conformité',
          quantite: 25,
          placement: 11,
          categorieId: categories[2].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'ISO 27001 Ready',
          prix: 2499.99,
          description: 'Programme de préparation à la certification ISO 27001',
          quantite: 20,
          placement: 12,
          categorieId: categories[2].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'RGPD Compliance',
          prix: 1799.99,
          description: 'Service de mise en conformité RGPD',
          quantite: 30,
          placement: 13,
          categorieId: categories[2].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'Security Training+',
          prix: 299.99,
          description: 'Formation avancée en cybersécurité pour les équipes',
          quantite: 100,
          placement: 14,
          categorieId: categories[2].id,
        },
      }),
      prisma.produit.create({
        data: {
          nom: 'Incident Response Plan',
          prix: 1499.99,
          description: 'Développement de plan de réponse aux incidents sur mesure',
          quantite: 25,
          placement: 15,
          categorieId: categories[2].id,
        },
      }),
    ])

    console.log('Creating sample user...')
    const userPassword = await bcrypt.hash('user123', 10)
    const user = await prisma.user.create({
      data: {
        email: 'user@example.com',
        mdp: userPassword,
        nom: 'Doe',
        prenom: 'John',
        adresse: '123 Main St',
        role: Role.USER,
        verified: true,
        // Remove stripeCustomerId - let Stripe create it during checkout
      },
    })

    console.log('Creating cart items...')
    await prisma.panier.create({
      data: {
        userId: user.id,
        produitId: products[0].id,
        quantite: 1,
      },
    })

    console.log('Creating previous order...')
    await prisma.previousOrder.create({
      data: {
        userId: user.id,
        produitId: products[1].id,
        quantite: 2,
        prixUnitaire: 29.99,
        prixTotalPasse: 5998, // Stored as cents
      },
    })

    console.log('Creating subscription...')
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        produitId: products[2].id,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'active',
        stripeSubId: 'sub_test',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        cancelAtPeriodEnd: false,
      },
    })

    console.log('Creating payment record...')
    await prisma.payment.create({
      data: {
        subscriptionId: subscription.id,
        userId: user.id,
        amount: 39.99,
        currency: 'EUR',
        stripePaymentId: 'pi_test',
        status: 'succeeded',
      },
    })

    console.log('Creating sample text content...')
    await prisma.text.create({
      data: {
        content: 'Bienvenue sur notre boutique en ligne!',
      },
    })

    console.log('Creating sample carousel image...')
    const sampleImagePath = path.join(__dirname, 'sample-image.jpg')
    if (fs.existsSync(sampleImagePath)) {
      const imageBuffer = fs.readFileSync(sampleImagePath)
      await prisma.carouselImage.create({
        data: {
          data: imageBuffer,
          title: 'Bannière principale',
          order: 1,
          active: true,
          contentType: ImageType.JPEG,
        },
      })
    }

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error during seeding:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed DB:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
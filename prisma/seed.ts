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
        // Remove stripeCustomerId - let Stripe create it during checkout
      },
    })

    console.log('Creating categories...')
    const categories = await Promise.all([
      prisma.categorie.create({ data: { nom: 'Électronique' } }),
      prisma.categorie.create({ data: { nom: 'Vêtements' } }),
      prisma.categorie.create({ data: { nom: 'Livres' } }),
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
      prisma.produit.create({
        data: {
        nom: 'Smartphone XYZ',
        prix: 599.99,
        description: 'Un smartphone dernière génération',
        quantite: 50,
        placement: 1,
        categorieId: categories[0].id,
        },
      }),
      prisma.produit.create({
        data: {
        nom: 'T-shirt Premium',
        prix: 29.99,
        description: 'T-shirt 100% coton bio',
        quantite: 100,
        placement: 2,
        categorieId: categories[1].id,
        },
      }),
      prisma.produit.create({
        data: {
        nom: 'Guide du développeur',
        prix: 39.99,
        description: 'Le guide complet du développement moderne',
        quantite: 75,
        placement: 3,
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
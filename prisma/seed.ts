import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const products = [
  { name: "Aura Pro", category: "Casques audio", price: 249, rating: 4.8, stock: 34, icon: "Headphones",
    tagline: "Réduction de bruit active nouvelle génération", description: "Casque premium à réduction de bruit active.",
    specs: { "Autonomie": "38h", "Réduction de bruit": "Active adaptative", "Poids": "254 g", "Bluetooth": "5.3" } },
  { name: "Nimbus Lite", category: "Casques audio", price: 89, rating: 4.4, stock: 61, icon: "Headphones",
    tagline: "Léger, confortable, prêt pour toute la journée", description: "Casque léger pour un usage quotidien.",
    specs: { "Autonomie": "24h", "Réduction de bruit": "Passive", "Poids": "180 g", "Bluetooth": "5.1" } },
  { name: "Flux Buds", category: "Casques audio", price: 129, rating: 4.5, stock: 48, icon: "Headphones",
    tagline: "Écouteurs intra-auriculaires, étui de charge rapide", description: "Écouteurs sans fil avec étui de charge.",
    specs: { "Autonomie": "6h + 24h boîtier", "Réduction de bruit": "Active", "Étanchéité": "IPX4", "Bluetooth": "5.3" } },
  { name: "Vertex 14", category: "Ordinateurs", price: 1399, rating: 4.7, stock: 18, icon: "Laptop",
    tagline: "Puissance et autonomie dans un châssis fin", description: "Ordinateur portable performant et fin.",
    specs: { "Processeur": "8 cœurs 3.4GHz", "RAM": "16 Go", "Stockage": "512 Go SSD", "Écran": "14\" 120Hz" } },
  { name: "Vertex 16 Pro", category: "Ordinateurs", price: 1899, rating: 4.9, stock: 11, icon: "Laptop",
    tagline: "Pour la création et le calcul intensif", description: "Ordinateur portable puissant pour professionnels.",
    specs: { "Processeur": "12 cœurs 3.8GHz", "RAM": "32 Go", "Stockage": "1 To SSD", "Écran": "16\" 120Hz" } },
  { name: "Halo Air", category: "Ordinateurs", price: 1099, rating: 4.5, stock: 27, icon: "Laptop",
    tagline: "1.1 kg, autonomie 18h, toujours avec vous", description: "Ordinateur portable ultra-léger.",
    specs: { "Processeur": "8 cœurs 3.1GHz", "RAM": "16 Go", "Stockage": "256 Go SSD", "Écran": "13.6\" 60Hz" } },
  { name: "Prisme X", category: "Smartphones", price: 999, rating: 4.8, stock: 22, icon: "Smartphone",
    tagline: "Écran fluide, photo pro, autonomie record", description: "Smartphone haut de gamme.",
    specs: { "Écran": "6.1\" OLED 120Hz", "Stockage": "256 Go", "Batterie": "4500 mAh", "Photo": "48 MP" } },
  { name: "Prisme X Mini", category: "Smartphones", price: 799, rating: 4.6, stock: 33, icon: "Smartphone",
    tagline: "Le compact qui ne fait aucun compromis", description: "Smartphone compact et performant.",
    specs: { "Écran": "5.8\" OLED 120Hz", "Stockage": "128 Go", "Batterie": "3800 mAh", "Photo": "48 MP" } },
  { name: "Onde 12", category: "Smartphones", price: 599, rating: 4.3, stock: 40, icon: "Smartphone",
    tagline: "L'essentiel, bien exécuté", description: "Smartphone au bon rapport qualité-prix.",
    specs: { "Écran": "6.4\" OLED 90Hz", "Stockage": "128 Go", "Batterie": "5000 mAh", "Photo": "32 MP" } },
  { name: "Cadence 2", category: "Montres connectées", price: 349, rating: 4.6, stock: 29, icon: "Watch",
    tagline: "Suivi santé complet, cadran toujours allumé", description: "Montre connectée avec suivi santé.",
    specs: { "Autonomie": "5 jours", "Étanchéité": "5 ATM", "Capteurs": "Cardio, SpO2, GPS", "Compatibilité": "iOS / Android" } },
  { name: "Cadence 2 Sport", category: "Montres connectées", price: 379, rating: 4.7, stock: 20, icon: "Watch",
    tagline: "Bracelet renforcé, taillée pour l'entraînement", description: "Montre connectée sportive.",
    specs: { "Autonomie": "6 jours", "Étanchéité": "10 ATM", "Capteurs": "Cardio, SpO2, GPS", "Compatibilité": "iOS / Android" } },
  { name: "Orbe Mini", category: "Enceintes", price: 79, rating: 4.4, stock: 55, icon: "Speaker",
    tagline: "Le son plein, format poche", description: "Enceinte portable compacte.",
    specs: { "Puissance": "12W", "Autonomie": "10h", "Étanchéité": "IPX7", "Bluetooth": "5.2" } },
  { name: "Orbe Max", category: "Enceintes", price: 199, rating: 4.7, stock: 24, icon: "Speaker",
    tagline: "Grave profond, 360° immersif", description: "Enceinte puissante à son 360°.",
    specs: { "Puissance": "40W", "Autonomie": "16h", "Étanchéité": "IPX7", "Bluetooth": "5.3" } },
  { name: "Lumen Z", category: "Appareils photo", price: 1299, rating: 4.8, stock: 9, icon: "Camera",
    tagline: "Plein format, précision professionnelle", description: "Appareil photo plein format professionnel.",
    specs: { "Capteur": "24 MP plein format", "Vidéo": "4K60", "Stabilisation": "5 axes", "Poids": "550 g" } },
  { name: "Onde Pad", category: "Tablettes", price: 649, rating: 4.6, stock: 31, icon: "Tablet",
    tagline: "Grand écran, autonomie d'une journée entière", description: "Tablette grand écran polyvalente.",
    specs: { "Écran": "11\" Liquid Retina", "Stockage": "256 Go", "Puce": "Octa-core", "Autonomie": "10h" } },
  { name: "Flux Mech", category: "Accessoires", price: 149, rating: 4.5, stock: 42, icon: "Keyboard",
    tagline: "Mécanique, silencieuse, rétroéclairée", description: "Clavier mécanique rétroéclairé.",
    specs: { "Type": "Switch rouge", "Connexion": "Bluetooth / USB-C", "Rétroéclairage": "RGB", "Autonomie": "200h" } },
];

async function main() {
  console.log("Suppression des produits existants...");
  await prisma.product.deleteMany();

  console.log("Insertion des nouveaux produits...");
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    await prisma.product.create({
      data: {
        ...p,
        reviews: 80 + ((i * 137) % 2200),
        prime: p.price < 300 || i % 3 === 0,
        images: [],
      },
    });
  }
  console.log(`${products.length} produits insérés avec succès !`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
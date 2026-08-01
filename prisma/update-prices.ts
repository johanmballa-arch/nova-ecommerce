import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Prix convertis en FCFA (arrondis pour un affichage propre)
const pricesByName: Record<string, number> = {
  "Aura Pro": 163000,
  "Nimbus Lite": 58000,
  "Flux Buds": 84000,
  "Vertex 14": 916000,
  "Vertex 16 Pro": 1244000,
  "Halo Air": 720000,
  "Prisme X": 654000,
  "Prisme X Mini": 523000,
  "Onde 12": 392000,
  "Cadence 2": 229000,
  "Cadence 2 Sport": 248000,
  "Orbe Mini": 52000,
  "Orbe Max": 130000,
  "Lumen Z": 851000,
  "Onde Pad": 425000,
  "Flux Mech": 98000,
};

async function main() {
  console.log("Conversion des prix en FCFA...");
  let updated = 0;

  for (const [name, price] of Object.entries(pricesByName)) {
    const result = await prisma.product.updateMany({
      where: { name },
      data: { price },
    });
    if (result.count > 0) updated += result.count;
  }

  console.log(`${updated} produits mis à jour avec un prix en FCFA.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
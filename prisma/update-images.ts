import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Une image réelle (Picsum) différente par produit, via une graine fixe
const imagesByName: Record<string, string> = {
  "Aura Pro": "https://picsum.photos/seed/nova-aura-pro/600/600",
  "Nimbus Lite": "https://picsum.photos/seed/nova-nimbus-lite/600/600",
  "Flux Buds": "https://picsum.photos/seed/nova-flux-buds/600/600",
  "Vertex 14": "https://picsum.photos/seed/nova-vertex-14/600/600",
  "Vertex 16 Pro": "https://picsum.photos/seed/nova-vertex-16-pro/600/600",
  "Halo Air": "https://picsum.photos/seed/nova-halo-air/600/600",
  "Prisme X": "https://picsum.photos/seed/nova-prisme-x/600/600",
  "Prisme X Mini": "https://picsum.photos/seed/nova-prisme-x-mini/600/600",
  "Onde 12": "https://picsum.photos/seed/nova-onde-12/600/600",
  "Cadence 2": "https://picsum.photos/seed/nova-cadence-2/600/600",
  "Cadence 2 Sport": "https://picsum.photos/seed/nova-cadence-2-sport/600/600",
  "Orbe Mini": "https://picsum.photos/seed/nova-orbe-mini/600/600",
  "Orbe Max": "https://picsum.photos/seed/nova-orbe-max/600/600",
  "Lumen Z": "https://picsum.photos/seed/nova-lumen-z/600/600",
  "Onde Pad": "https://picsum.photos/seed/nova-onde-pad/600/600",
  "Flux Mech": "https://picsum.photos/seed/nova-flux-mech/600/600",
};

async function main() {
  console.log("Mise à jour des images produits...");
  let updated = 0;

  for (const [name, url] of Object.entries(imagesByName)) {
    const result = await prisma.product.updateMany({
      where: { name },
      data: { images: [url] },
    });
    if (result.count > 0) updated += result.count;
  }

  console.log(`${updated} produits mis à jour avec une image.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
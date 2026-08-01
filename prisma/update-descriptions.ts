import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const descriptionsByName: Record<string, { tagline: string; description: string }> = {
  "Aura Pro": {
    tagline: "Réduction de bruit active nouvelle génération",
    description:
      "Le Aura Pro redéfinit l'écoute premium. Sa réduction de bruit active adaptative s'ajuste en temps réel à ton environnement, tandis que ses 38h d'autonomie t'accompagnent sans interruption. Un son signé pour les exigeants.",
  },
  "Nimbus Lite": {
    tagline: "Léger, confortable, prêt pour toute la journée",
    description:
      "Pensé pour l'usage quotidien, le Nimbus Lite combine légèreté et confort longue durée. Son design épuré et ses 24h d'autonomie en font le compagnon idéal du télétravail comme des trajets.",
  },
  "Flux Buds": {
    tagline: "Écouteurs intra-auriculaires, étui de charge rapide",
    description:
      "Compacts et puissants, les Flux Buds tiennent dans une poche et libèrent un son riche à la demande. Étui de charge rapide inclus pour ne jamais rester à court d'énergie.",
  },
  "Vertex 14": {
    tagline: "Puissance et autonomie dans un châssis fin",
    description:
      "Le Vertex 14 allie performance et mobilité. Son processeur 8 cœurs et son écran 120Hz encaissent le multitâche exigeant, dans un châssis fin taillé pour te suivre partout.",
  },
  "Vertex 16 Pro": {
    tagline: "Pour la création et le calcul intensif",
    description:
      "Conçu pour les créateurs et les charges de travail intensives, le Vertex 16 Pro embarque 12 cœurs et 32 Go de RAM. Le montage vidéo, le rendu 3D et le développement n'ont jamais été aussi fluides.",
  },
  "Halo Air": {
    tagline: "1.1 kg, autonomie 18h, toujours avec vous",
    description:
      "Ultra-léger à 1,1 kg, le Halo Air ne sacrifie ni la puissance ni l'autonomie. 18h sur batterie pour travailler où que tu sois, sans jamais chercher une prise.",
  },
  "Prisme X": {
    tagline: "Écran fluide, photo pro, autonomie record",
    description:
      "Le Prisme X capture l'instant avec un capteur 48MP et restitue chaque image sur un écran OLED 120Hz éclatant. Une autonomie généreuse pour ne jamais manquer un moment.",
  },
  "Prisme X Mini": {
    tagline: "Le compact qui ne fait aucun compromis",
    description:
      "Format compact, ambitions intactes : le Prisme X Mini embarque les mêmes fondamentaux que son grand frère dans un format qui se glisse dans n'importe quelle poche.",
  },
  "Onde 12": {
    tagline: "L'essentiel, bien exécuté",
    description:
      "Le Onde 12 mise sur l'essentiel : grand écran, grosse batterie, prix maîtrisé. Le smartphone parfait pour un usage quotidien sans concession sur la fiabilité.",
  },
  "Cadence 2": {
    tagline: "Suivi santé complet, cadran toujours allumé",
    description:
      "La Cadence 2 surveille ton rythme cardiaque, ton sommeil et ton activité en continu. Son cadran toujours allumé garde l'essentiel à portée de vue, jour et nuit.",
  },
  "Cadence 2 Sport": {
    tagline: "Bracelet renforcé, taillée pour l'entraînement",
    description:
      "Conçue pour l'effort, la Cadence 2 Sport résiste à l'eau jusqu'à 10 ATM et encaisse les entraînements les plus intenses grâce à son bracelet renforcé.",
  },
  "Orbe Mini": {
    tagline: "Le son plein, format poche",
    description:
      "Ne te fie pas à sa taille : l'Orbe Mini délivre un son plein et chaud partout où tu vas. Étanche IPX7, elle t'accompagne à la plage comme sous la douche.",
  },
  "Orbe Max": {
    tagline: "Grave profond, 360° immersif",
    description:
      "L'Orbe Max transforme n'importe quelle pièce en salle de concert. Diffusion sonore à 360°, graves profonds et 16h d'autonomie pour ne jamais couper la musique.",
  },
  "Lumen Z": {
    tagline: "Plein format, précision professionnelle",
    description:
      "Le Lumen Z s'adresse aux photographes exigeants. Capteur plein format 24MP, vidéo 4K60 et stabilisation 5 axes : chaque prise de vue devient une œuvre maîtrisée.",
  },
  "Onde Pad": {
    tagline: "Grand écran, autonomie d'une journée entière",
    description:
      "Idéale pour le streaming, la lecture ou le travail nomade, la Onde Pad offre un grand écran Liquid Retina et une autonomie qui tient toute la journée sans recharge.",
  },
  "Flux Mech": {
    tagline: "Mécanique, silencieuse, rétroéclairée",
    description:
      "Le clavier Flux Mech combine la précision des switches mécaniques avec un fonctionnement silencieux. Rétroéclairage RGB personnalisable et 200h d'autonomie sans fil.",
  },
};

async function main() {
  console.log("Mise à jour des descriptions...");
  let updated = 0;

  for (const [name, content] of Object.entries(descriptionsByName)) {
    const result = await prisma.product.updateMany({
      where: { name },
      data: {
        tagline: content.tagline,
        description: content.description,
      },
    });
    if (result.count > 0) updated += result.count;
  }

  console.log(`${updated} produits mis à jour avec de nouvelles descriptions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
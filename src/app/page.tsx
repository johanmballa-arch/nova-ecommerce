import { prisma } from "@/lib/prisma";
import { HomeClient } from "@/components/HomeClient";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <HomeClient products={products} />;
}
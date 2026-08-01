import { prisma } from "@/lib/prisma";
import { CatalogClient } from "@/components/CatalogClient";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <CatalogClient
      products={products}
      initialCategory={params.category || "Toutes"}
      initialQuery={params.q || ""}
    />
  );
}
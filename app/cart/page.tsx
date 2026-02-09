import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CartClient } from "./CartClient";

export default async function CartPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/cart");

  const items = await prisma.cartItem.findMany({
    where: { userId: session.id },
    include: { product: true },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">장바구니</h1>
      <CartClient items={items} />
    </div>
  );
}

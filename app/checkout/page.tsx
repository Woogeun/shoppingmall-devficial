import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "./CheckoutForm";

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/checkout");

  const [cartItems, addresses] = await Promise.all([
    prisma.cartItem.findMany({
      where: { userId: session.id },
      include: { product: true },
    }),
    prisma.address.findMany({
      where: { userId: session.id },
      orderBy: { id: "asc" },
    }),
  ]);

  if (cartItems.length === 0) redirect("/cart");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl font-bold text-foreground mb-6">주문/결제</h1>
      <CheckoutForm cartItems={cartItems} addresses={addresses} />
    </div>
  );
}

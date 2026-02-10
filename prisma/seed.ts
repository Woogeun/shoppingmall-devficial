import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const url =
  process.env.DATABASE_URL ||
  `file:${path.join(process.cwd(), "prisma", "dev.db")}`;
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@shoppingmall.com" },
    update: {},
    create: {
      email: "admin@shoppingmall.com",
      password: "admin123",
      name: "관리자",
      role: "ADMIN",
    },
  });
  console.log("Admin user:", admin.email);

  const customer = await prisma.user.upsert({
    where: { email: "user@test.com" },
    update: {},
    create: {
      email: "user@test.com",
      password: "user123",
      name: "테스트회원",
      role: "CUSTOMER",
    },
  });
  console.log("Customer user:", customer.email);

  const products = [
    { name: "클래식 스니커즈 화이트", slug: "classic-sneakers-white", brand: "ShoeBrand", category: "스니커즈", price: 89000 },
    { name: "러닝 슈즈 블랙", slug: "running-shoes-black", brand: "RunFast", category: "러닝화", price: 129000 },
    { name: "캐주얼 로퍼 브라운", slug: "casual-loafers-brown", brand: "DailyWalk", category: "로퍼", price: 75000 },
    { name: "빈티지 스니커즈 네이비", slug: "vintage-sneakers-navy", brand: "ShoeBrand", category: "스니커즈", price: 95000 },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        brand: p.brand,
        category: p.category,
        price: p.price,
        description: `${p.name} 상품입니다.`,
        published: true,
      },
    });
    const sizes = ["230", "240", "250", "260", "270"];
    for (const size of sizes) {
      await prisma.inventory.upsert({
        where: {
          productId_size: { productId: product.id, size },
        },
        update: {},
        create: {
          productId: product.id,
          size,
          quantity: Math.floor(Math.random() * 20) + 5,
        },
      });
    }
    console.log("Product:", product.name);
  }

  const existingBanner = await prisma.marketingContent.findFirst({
    where: { type: "BANNER", title: "봄 시즌 신발 특가" },
  });
  if (!existingBanner) {
    await prisma.marketingContent.create({
      data: {
        title: "봄 시즌 신발 특가",
        type: "BANNER",
        content: "인기 신발 최대 30% 할인",
        linkUrl: "/products",
        active: true,
        sortOrder: 0,
      },
    });
    console.log("Marketing banner created.");
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });

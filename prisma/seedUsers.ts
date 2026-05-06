import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const users = [
    { name: "Admin User", email: "admin@insurance.com", password: "admin123", role: "admin" },
    { name: "Manager User", email: "manager@insurance.com", password: "manager123", role: "manager" },
    { name: "Viewer User", email: "viewer@insurance.com", password: "viewer123", role: "viewer" },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);

    await db.user.upsert({
      where: { email: user.email },
      update: { hashedPassword, role: user.role },
      create: {
        name: user.name,
        email: user.email,
        hashedPassword,
        role: user.role,
      },
    });

    console.log(`✅ Seeded user: ${user.email}`);
  }
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
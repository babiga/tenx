import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Default admin credentials
  const adminEmail = process.env.ADMIN_EMAIL || "admin@tenx.mn";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  const adminName = process.env.ADMIN_NAME || "System Admin";

  // Check if admin already exists
  const existingAdmin = await prisma.dashboardUser.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  // Create admin user
  const admin = await prisma.dashboardUser.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      role: "ADMIN",
      isVerified: true,
      isActive: true,
    },
  });

  console.log(`Admin user created successfully:`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Name: ${admin.name}`);
  console.log(`  Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

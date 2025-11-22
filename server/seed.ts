import { getDb } from "./db";
import { users, adminUsers } from "@shared/schema";
import bcrypt from "bcryptjs";

export async function seedDatabase() {
  console.log("🌱 Seeding database...");

  try {
    const db = await getDb();
    // Check if demo user exists
    const existingUsers = await db.select().from(users).limit(1);
    if (existingUsers.length === 0) {
      console.log("Creating demo user...");
      // Create demo user
      await db.insert(users).values({
        username: "demo",
        password: await bcrypt.hash("demo123", 10),
        email: "demo@mekness.com",
        fullName: "Demo User",
        phone: "+1234567890",
        country: "United States",
        city: "New York",
        address: "123 Trading Street",
        zipCode: "10001",
        verified: true,
        enabled: true,
      });
      console.log("✓ Demo user created");
    }

    // Check if admin users exist
    const existingAdmins = await db.select().from(adminUsers).limit(1);
    if (existingAdmins.length === 0) {
      console.log("Creating admin users...");
      
      // Create super admin
      await db.insert(adminUsers).values({
        username: "superadmin",
        password: await bcrypt.hash("Admin@12345", 10),
        email: "superadmin@mekness.com",
        fullName: "Super Administrator",
        role: "super_admin",
        enabled: true,
        createdBy: null,
      });
      console.log("✓ Super admin created");

      // Create middle admin
      await db.insert(adminUsers).values({
        username: "middleadmin",
        password: await bcrypt.hash("Middle@12345", 10),
        email: "middleadmin@mekness.com",
        fullName: "Middle Administrator",
        role: "middle_admin",
        enabled: true,
        createdBy: null,
      });
      console.log("✓ Middle admin created");

      // Create normal admin
      await db.insert(adminUsers).values({
        username: "normaladmin",
        password: await bcrypt.hash("Normal@12345", 10),
        email: "normaladmin@mekness.com",
        fullName: "Normal Administrator",
        role: "normal_admin",
        enabled: true,
        createdBy: null,
      });
      console.log("✓ Normal admin created");
    }

    console.log("✅ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}


import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  try {
    // Check if admin user already exists
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      console.log("Admin user already exists");
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
    });

    console.log("Admin user created successfully:", user.username);

    // Create initial site settings
    const settings = await prisma.siteSettings.create({
      data: {
        artistName: "Your Name",
        artistBio: "Add your bio here...",
        artistJourney: "Share your artistic journey...",
        achievements: "List your achievements...",
        contactEmail: "your@email.com",
      },
    });

    console.log("Initial site settings created");

    // Create a default category
    const category = await prisma.category.create({
      data: {
        name: "Paintings",
        slug: "paintings",
        description: "Traditional and digital paintings",
      },
    });

    console.log("Default category created:", category.name);
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
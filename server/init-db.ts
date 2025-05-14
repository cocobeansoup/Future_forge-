import { db } from "./db";
import { platformFees } from "@shared/schema";

/**
 * Initialize the database with default values
 */
export async function initializeDatabase() {
  console.log("Initializing database with default values...");
  
  // Set up default platform fees
  await setupPlatformFees();
  
  console.log("Database initialization complete.");
}

/**
 * Set up default platform fees of 5% for different transaction types
 */
async function setupPlatformFees() {
  const existingFees = await db.select().from(platformFees);
  
  if (existingFees.length === 0) {
    console.log("Setting up default platform fees (5%)...");
    
    const feeTypes = [
      { type: "investment", description: "Fee applied to investments in inventions" },
      { type: "sale", description: "Fee applied to direct sales of inventions" },
      { type: "auction", description: "Fee applied to auction sales of inventions" }
    ];
    
    for (const { type, description } of feeTypes) {
      await db.insert(platformFees).values({
        feeType: type,
        percentage: "5.0", // 5% fee
        description,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    console.log("Platform fees initialized successfully.");
  } else {
    console.log("Platform fees already exist. Skipping initialization.");
  }
}
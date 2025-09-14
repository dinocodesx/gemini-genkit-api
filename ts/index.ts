import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model("gemini-2.5-flash", {
    temperature: 0.8,
  }),
});

// Define input schema for restaurant specifications
const RestaurantInputSchema = z.object({
  name: z.string().describe("Name of the restaurant"),
  theme: z
    .string()
    .describe(
      "Restaurant theme or concept (e.g., 'pirate tavern', 'space diner', 'medieval feast')"
    ),
  cuisineType: z
    .string()
    .describe("Type of cuisine (e.g., 'Italian', 'fusion', 'comfort food')"),
  priceRange: z
    .enum(["budget", "mid-range", "upscale", "fine-dining"])
    .describe("Price range of the restaurant"),
  atmosphere: z
    .string()
    .describe(
      "Atmosphere or vibe (e.g., 'cozy', 'bustling', 'romantic', 'family-friendly')"
    ),
  specialFeature: z
    .string()
    .optional()
    .describe("Any special feature or gimmick of the restaurant"),
});

// Define menu item schema
const MenuItemSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.string(),
});

// Define output schema for restaurant menu
const RestaurantMenuSchema = z.object({
  restaurantName: z.string(),
  tagline: z.string().describe("Catchy restaurant tagline or slogan"),
  appetizers: z.array(MenuItemSchema),
  mains: z.array(MenuItemSchema),
  desserts: z.array(MenuItemSchema),
  beverages: z.array(MenuItemSchema),
  specialties: z
    .array(MenuItemSchema)
    .optional()
    .describe("Signature dishes or chef's specials"),
  funFact: z.string().describe("An amusing fact about the restaurant"),
  ambiance: z
    .string()
    .describe("Description of the restaurant's atmosphere and decor"),
});

// Define a restaurant menu generator flow
export const restaurantMenuGeneratorFlow = ai.defineFlow(
  {
    name: "restaurantMenuGeneratorFlow",
    inputSchema: RestaurantInputSchema,
    outputSchema: RestaurantMenuSchema,
  },
  async (input) => {
    // Create an elaborate and funny prompt for menu generation
    const prompt = `You are a creative restaurant consultant tasked with designing a complete menu for a new restaurant. Be creative, funny, and engaging while maintaining authenticity to the restaurant concept.

    Restaurant Specifications:
    - Name: ${input.name}
    - Theme/Concept: ${input.theme}
    - Cuisine Type: ${input.cuisineType}
    - Price Range: ${input.priceRange}
    - Atmosphere: ${input.atmosphere}
    - Special Feature: ${input.specialFeature || "None specified"}

    Generate a complete restaurant menu that perfectly captures the theme and personality of this establishment. Include:
    - A catchy tagline that embodies the restaurant's spirit
    - Creative and themed menu item names that are both appetizing and amusing
    - Detailed descriptions that make each dish sound irresistible
    - Appropriate pricing for the specified price range
    - At least 4-6 items in each category (appetizers, mains, desserts, beverages)
    - Optional specialty items that showcase the restaurant's unique character
    - A fun fact about the restaurant that guests would find entertaining
    - A vivid description of the restaurant's ambiance and decor

    Make the menu items sound delicious while incorporating humor and theme-appropriate wordplay. The descriptions should be enticing enough to make customers want to order everything!`;

    // Generate structured menu data
    const { output } = await ai.generate({
      prompt,
      output: { schema: RestaurantMenuSchema },
    });

    if (!output) throw new Error("Failed to generate restaurant menu");

    return output;
  }
);

// Run the flow with a creative restaurant example
async function main() {
  const menu = await restaurantMenuGeneratorFlow({
    name: "The Cosmic Cantina",
    theme: "intergalactic space diner with retro-futuristic vibes",
    cuisineType: "fusion comfort food",
    priceRange: "mid-range",
    atmosphere:
      "quirky and family-friendly with neon lights and space memorabilia",
    specialFeature:
      "all dishes are served on LED-lit plates and the waitstaff wear space suits",
  });

  console.log("🚀 Welcome to", menu.restaurantName, "🚀");
  console.log("Tagline:", menu.tagline);
  console.log("\n🌌 AMBIANCE:", menu.ambiance);
  console.log("\n⭐ FUN FACT:", menu.funFact);

  console.log("\n🛸 APPETIZERS:");
  menu.appetizers.forEach((item) =>
    console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
  );

  console.log("\n🌟 MAIN COURSES:");
  menu.mains.forEach((item) =>
    console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
  );

  console.log("\n🍨 DESSERTS:");
  menu.desserts.forEach((item) =>
    console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
  );

  console.log("\n🥤 BEVERAGES:");
  menu.beverages.forEach((item) =>
    console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
  );

  if (menu.specialties && menu.specialties.length > 0) {
    console.log("\n⚡ CHEF'S SPECIALTIES:");
    menu.specialties.forEach((item) =>
      console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
    );
  }
}

main().catch(console.error);

import { googleAI } from "@genkit-ai/google-genai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import { genkit, z } from "genkit";
import * as path from "path";

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

// Define enhanced schema for visual menu card design specifications
const MenuCardDesignSchema = z.object({
  colorScheme: z.object({
    primary: z.string().describe("Primary color for the menu card"),
    secondary: z.string().describe("Secondary accent color"),
    background: z.string().describe("Background color or gradient"),
    text: z.string().describe("Text color for readability"),
  }),
  typography: z.object({
    headerFont: z
      .string()
      .describe("Font style for restaurant name and headers"),
    bodyFont: z.string().describe("Font style for menu items and descriptions"),
    accent: z.string().describe("Special font for prices and highlights"),
  }),
  layoutStyle: z
    .string()
    .describe("Overall layout style (elegant, modern, rustic, etc.)"),
  decorativeElements: z
    .string()
    .describe("Visual elements that match the restaurant theme"),
  backgroundTexture: z.string().describe("Background texture or pattern"),
});

// Define input schema for menu card design flow (includes both restaurant specs and menu data)
const MenuCardDesignInputSchema = z.object({
  restaurantSpecs: RestaurantInputSchema,
  menuData: RestaurantMenuSchema,
});

// Define combined output schema for the complete restaurant package
const CompleteRestaurantPackageSchema = z.object({
  restaurantSpecs: RestaurantInputSchema,
  menuData: RestaurantMenuSchema,
  designSpecs: MenuCardDesignSchema,
  imagePath: z.string().describe("Path to the generated menu card image"),
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

    // Generate structured menu data - Genkit Model Calling
    const { output } = await ai.generate({
      prompt,
      output: { schema: RestaurantMenuSchema },
    });

    if (!output) throw new Error("Failed to generate restaurant menu");

    return output;
  }
);

// Define a flow to generate visual design specifications for the menu card
export const menuCardDesignFlow = ai.defineFlow(
  {
    name: "menuCardDesignFlow",
    inputSchema: MenuCardDesignInputSchema,
    outputSchema: MenuCardDesignSchema,
  },
  async (input) => {
    const { restaurantSpecs, menuData } = input;

    const prompt = `You are a professional graphic designer specializing in restaurant branding. Create comprehensive visual design specifications for a menu card that perfectly matches the restaurant's identity and complements the actual menu content.

    Restaurant Specifications:
    - Name: ${restaurantSpecs.name}
    - Theme/Concept: ${restaurantSpecs.theme}
    - Cuisine Type: ${restaurantSpecs.cuisineType}
    - Price Range: ${restaurantSpecs.priceRange}
    - Atmosphere: ${restaurantSpecs.atmosphere}
    - Special Feature: ${restaurantSpecs.specialFeature || "None specified"}

    Menu Content Analysis:
    - Restaurant Name: ${menuData.restaurantName}
    - Tagline: ${menuData.tagline}
    - Number of Appetizers: ${menuData.appetizers.length}
    - Number of Main Courses: ${menuData.mains.length}
    - Number of Desserts: ${menuData.desserts.length}
    - Number of Beverages: ${menuData.beverages.length}
    - Has Specialties: ${
      menuData.specialties && menuData.specialties.length > 0 ? "Yes" : "No"
    }
    - Ambiance Description: ${menuData.ambiance}
    - Fun Fact: ${menuData.funFact}

    Design a visual identity that captures the essence of this restaurant and works well with the actual menu content. Consider:
    - Color psychology that matches the theme, cuisine, and menu personality
    - Typography that reflects the restaurant's personality and ensures readability for all menu items
    - Layout style that suits the price range, atmosphere, and menu content volume
    - Decorative elements that enhance the theme without overwhelming the menu text
    - Background textures that complement the overall design and menu readability

    The design should be both visually appealing and functional for displaying the generated menu content effectively.`;

    const { output } = await ai.generate({
      prompt,
      output: { schema: MenuCardDesignSchema },
    });

    if (!output)
      throw new Error("Failed to generate menu card design specifications");

    return output;
  }
);

// Function to generate visual menu card using Gemini 2.5 Flash Image model
async function generateMenuCardImage(
  menu: any,
  design: any,
  restaurantSpecs: any
): Promise<string> {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-image-preview",
  });

  // Create a detailed prompt for menu card image generation
  const imagePrompt = `Create a professional, high-quality restaurant menu card design for "${
    menu.restaurantName
  }".

RESTAURANT DETAILS:
- Name: ${menu.restaurantName}
- Tagline: ${menu.tagline}
- Theme: ${restaurantSpecs.theme}
- Cuisine: ${restaurantSpecs.cuisineType}
- Price Range: ${restaurantSpecs.priceRange}
- Atmosphere: ${restaurantSpecs.atmosphere}

DESIGN SPECIFICATIONS:
- Color Scheme: Primary ${design.colorScheme.primary}, Secondary ${
    design.colorScheme.secondary
  }, Background ${design.colorScheme.background}
- Typography: Headers in ${design.typography.headerFont}, Body in ${
    design.typography.bodyFont
  }
- Layout Style: ${design.layoutStyle}
- Decorative Elements: ${design.decorativeElements}
- Background: ${design.backgroundTexture}

MENU CONTENT TO INCLUDE:
Restaurant Name: ${menu.restaurantName}
Tagline: ${menu.tagline}

APPETIZERS:
${menu.appetizers
  .map((item: any) => `• ${item.name} - ${item.price}\n  ${item.description}`)
  .join("\n")}

MAIN COURSES:
${menu.mains
  .map((item: any) => `• ${item.name} - ${item.price}\n  ${item.description}`)
  .join("\n")}

DESSERTS:
${menu.desserts
  .map((item: any) => `• ${item.name} - ${item.price}\n  ${item.description}`)
  .join("\n")}

BEVERAGES:
${menu.beverages
  .map((item: any) => `• ${item.name} - ${item.price}\n  ${item.description}`)
  .join("\n")}

${
  menu.specialties && menu.specialties.length > 0
    ? `CHEF'S SPECIALTIES:\n${menu.specialties
        .map(
          (item: any) => `• ${item.name} - ${item.price}\n  ${item.description}`
        )
        .join("\n")}`
    : ""
}

REQUIREMENTS:
- Create a visually stunning, professional menu card design
- Use elegant typography that matches the ${design.layoutStyle} style
- Apply the specified color scheme consistently
- Include all menu items with clear, readable pricing
- Add decorative elements that enhance the ${restaurantSpecs.theme} theme
- Ensure excellent readability and visual hierarchy
- Make it look like a real, high-end restaurant menu card
- Include subtle ${design.backgroundTexture} background texture
- Size should be suitable for a restaurant menu (portrait orientation)

The final design should be sophisticated, on-brand, and enticing to potential customers.`;

  try {
    const result = await model.generateContent([imagePrompt]);
    const response = await result.response;

    // Check if the response contains image data
    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      throw new Error("No candidates found in the response");
    }

    const firstCandidate = candidates[0];
    if (!firstCandidate || !firstCandidate.content) {
      throw new Error("No content found in the first candidate");
    }

    const parts = firstCandidate.content.parts;
    if (!parts || parts.length === 0) {
      throw new Error("No parts found in the candidate content");
    }

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        // Save the image to a file
        const imageData = part.inlineData.data;
        const imageBuffer = Buffer.from(imageData, "base64");

        // Create output directory if it doesn't exist
        const outputDir = path.join(process.cwd(), "generated_menus");
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `menu_card_${menu.restaurantName.replace(
          /[^a-zA-Z0-9]/g,
          "_"
        )}_${timestamp}.png`;
        const filepath = path.join(outputDir, filename);

        // Save the image
        fs.writeFileSync(filepath, imageBuffer);

        console.log(`🖼️  Menu card image saved: ${filepath}`);
        return filepath;
      }
    }

    throw new Error("No image data received from the model");
  } catch (error) {
    console.error("Error generating menu card image:", error);
    throw error;
  }
}

// Define the parent flow that orchestrates the complete restaurant package creation
export const completeRestaurantPackageFlow = ai.defineFlow(
  {
    name: "completeRestaurantPackageFlow",
    inputSchema: RestaurantInputSchema,
    outputSchema: CompleteRestaurantPackageSchema,
  },
  async (restaurantSpecs) => {
    console.log("🚀 Starting complete restaurant package generation...");

    // Step 1: Generate the text menu using the first child flow
    console.log("📝 Step 1: Generating restaurant menu...");
    const menuData = await restaurantMenuGeneratorFlow(restaurantSpecs);

    // Step 2: Generate design specifications using the second child flow
    // Pass both restaurant specs and menu data as input
    console.log("🎨 Step 2: Generating design specifications...");
    const designSpecs = await menuCardDesignFlow({
      restaurantSpecs,
      menuData,
    });

    // Step 3: Generate the visual menu card image
    console.log("🖼️  Step 3: Creating visual menu card...");
    const imagePath = await generateMenuCardImage(
      menuData,
      designSpecs,
      restaurantSpecs
    );

    // Return the complete package
    return {
      restaurantSpecs,
      menuData,
      designSpecs,
      imagePath,
    };
  }
);

// Run the flow with a creative restaurant example
async function main() {
  const restaurantSpecs = {
    name: "The Cosmic Cantina",
    theme: "intergalactic space diner with retro-futuristic vibes",
    cuisineType: "fusion comfort food",
    priceRange: "mid-range" as const,
    atmosphere:
      "quirky and family-friendly with neon lights and space memorabilia",
    specialFeature:
      "all dishes are served on LED-lit plates and the waitstaff wear space suits",
  };

  console.log("🚀 Generating complete restaurant package...\n");

  try {
    // Use the parent flow to orchestrate everything
    const result = await completeRestaurantPackageFlow(restaurantSpecs);

    const { menuData, designSpecs, imagePath } = result;

    // Display the results
    console.log("\n" + "=".repeat(60));
    console.log("🚀 Welcome to", menuData.restaurantName, "🚀");
    console.log("=".repeat(60));
    console.log("Tagline:", menuData.tagline);
    console.log("\n🌌 AMBIANCE:", menuData.ambiance);
    console.log("\n⭐ FUN FACT:", menuData.funFact);

    console.log("\n🛸 APPETIZERS:");
    menuData.appetizers.forEach((item) =>
      console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
    );

    console.log("\n🌟 MAIN COURSES:");
    menuData.mains.forEach((item) =>
      console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
    );

    console.log("\n🍨 DESSERTS:");
    menuData.desserts.forEach((item) =>
      console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
    );

    console.log("\n🥤 BEVERAGES:");
    menuData.beverages.forEach((item) =>
      console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
    );

    if (menuData.specialties && menuData.specialties.length > 0) {
      console.log("\n⚡ CHEF'S SPECIALTIES:");
      menuData.specialties.forEach((item) =>
        console.log(`• ${item.name} - ${item.price}\n  ${item.description}`)
      );
    }

    console.log("\n" + "=".repeat(60));
    console.log("🎨 VISUAL DESIGN SPECIFICATIONS");
    console.log("=".repeat(60));
    console.log("🎯 Layout Style:", designSpecs.layoutStyle);
    console.log("🎨 Color Scheme:");
    console.log(`  Primary: ${designSpecs.colorScheme.primary}`);
    console.log(`  Secondary: ${designSpecs.colorScheme.secondary}`);
    console.log(`  Background: ${designSpecs.colorScheme.background}`);
    console.log(`  Text: ${designSpecs.colorScheme.text}`);
    console.log("📝 Typography:");
    console.log(`  Headers: ${designSpecs.typography.headerFont}`);
    console.log(`  Body: ${designSpecs.typography.bodyFont}`);
    console.log(`  Accent: ${designSpecs.typography.accent}`);
    console.log("✨ Decorative Elements:", designSpecs.decorativeElements);
    console.log("🖼️  Background Texture:", designSpecs.backgroundTexture);

    console.log("\n" + "=".repeat(60));
    console.log("✅ GENERATION COMPLETE!");
    console.log("=".repeat(60));
    console.log(`📄 Text menu: Generated and displayed above`);
    console.log(`🖼️  Visual menu card: ${imagePath}`);
    console.log("\n🎉 Your restaurant menu is ready to serve customers!");
  } catch (error) {
    console.error("❌ Error generating restaurant materials:", error);
    process.exit(1);
  }
}

main().catch(console.error);

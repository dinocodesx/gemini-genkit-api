import { googleAI } from "@genkit-ai/google-genai";
import { genkit, z } from "genkit";

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model("gemini-2.5-flash", {
    temperature: 0.8,
  }),
});

// Define input schema
const RecipeInputSchema = z.object({
  ingredient: z.string().describe("Main ingredient or cuisine type"),
  dietaryRestrictions: z
    .string()
    .optional()
    .describe("Any dietary restrictions"),
});

// Define output schema
const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()).optional(),
});

// Define a recipe generator flow
export const recipeGeneratorFlow = ai.defineFlow(
  {
    name: "recipeGeneratorFlow",
    inputSchema: RecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (input) => {
    // Create a prompt based on the input
    const prompt = `Create a recipe with the following requirements:
      Main ingredient: ${input.ingredient}
      Dietary restrictions: ${input.dietaryRestrictions || "none"}`;

    // Generate structured recipe data using the same schema
    const { output } = await ai.generate({
      prompt,
      output: { schema: RecipeSchema },
    });

    if (!output) throw new Error("Failed to generate recipe");

    return output;
  }
);

// Run the flow
async function main() {
  const recipe = await recipeGeneratorFlow({
    ingredient: "avocado",
    dietaryRestrictions: "vegetarian",
  });

  console.log(recipe);
}

main().catch(console.error);

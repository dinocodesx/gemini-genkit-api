package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/firebase/genkit/go/ai"
	"github.com/firebase/genkit/go/genkit"
	"github.com/firebase/genkit/go/plugins/googlegenai"
	"github.com/firebase/genkit/go/plugins/server"
)

// Define input schema for food recipe requests
type FoodInput struct {
	FoodName            string `json:"foodName" jsonschema:"description=Name of the food to cook,required=true"`
	DietaryRestrictions string `json:"dietaryRestrictions,omitempty" jsonschema:"description=Any dietary restrictions (vegetarian, vegan, gluten-free, etc.)"`
	Difficulty          string `json:"difficulty,omitempty" jsonschema:"description=Preferred difficulty level (easy, medium, hard)"`
	ServingSize         int    `json:"servingSize,omitempty" jsonschema:"description=Number of servings needed"`
}

// Define output schema for recipe response
type FoodRecipe struct {
	Name         string   `json:"name"`
	Description  string   `json:"description"`
	Difficulty   string   `json:"difficulty"`
	PrepTime     string   `json:"prepTime"`
	CookTime     string   `json:"cookTime"`
	TotalTime    string   `json:"totalTime"`
	Servings     int      `json:"servings"`
	Ingredients  []string `json:"ingredients"`
	Instructions []string `json:"instructions"`
	Tips         []string `json:"tips,omitempty"`
	Nutrition    string   `json:"nutrition,omitempty"`
}

// Error response structure
type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message"`
}

func main() {
	ctx := context.Background()

	// Initialize Genkit with the Google AI plugin
	g := genkit.Init(ctx,
		genkit.WithPlugins(&googlegenai.GoogleAI{}),
		genkit.WithDefaultModel("googleai/gemini-2.0-flash"),
	)

	// Define the food recipe generator flow
	foodRecipeFlow := genkit.DefineFlow(g, "foodRecipeFlow", func(ctx context.Context, input *FoodInput) (*FoodRecipe, error) {
		// Validate input
		if strings.TrimSpace(input.FoodName) == "" {
			return nil, fmt.Errorf("food name is required")
		}

		// Set default values
		difficulty := input.Difficulty
		if difficulty == "" {
			difficulty = "medium"
		}

		servingSize := input.ServingSize
		if servingSize == 0 {
			servingSize = 4
		}

		dietaryRestrictions := input.DietaryRestrictions
		if dietaryRestrictions == "" {
			dietaryRestrictions = "none"
		}

		// Create a detailed prompt for recipe generation
		prompt := fmt.Sprintf(`Create a detailed, authentic recipe for "%s" with the following specifications:

		Food: %s
		Difficulty level: %s
		Servings: %d
		Dietary restrictions: %s

		Please provide:
		1. A brief description of the dish
		2. Accurate preparation and cooking times
		3. A complete ingredients list with specific quantities
		4. Step-by-step cooking instructions that are easy to follow
		5. Helpful cooking tips and techniques
		6. Basic nutritional information

		Make sure the recipe is practical and achievable for home cooking.`,
			input.FoodName, input.FoodName, difficulty, servingSize, dietaryRestrictions)

		// Generate structured recipe data
		recipe, _, err := genkit.GenerateData[FoodRecipe](ctx, g,
			ai.WithPrompt(prompt),
		)
		if err != nil {
			return nil, fmt.Errorf("failed to generate recipe for %s: %w", input.FoodName, err)
		}

		// Ensure the recipe name matches the input
		if recipe.Name == "" {
			recipe.Name = input.FoodName
		}

		// Set servings if not provided by AI
		if recipe.Servings == 0 {
			recipe.Servings = servingSize
		}

		return recipe, nil
	})

	// Test the flow with a sample request
	log.Println("Testing recipe generation...")
	sampleRecipe, err := foodRecipeFlow.Run(ctx, &FoodInput{
		FoodName:            "Pasta Carbonara",
		DietaryRestrictions: "",
		Difficulty:          "medium",
		ServingSize:         4,
	})
	if err != nil {
		log.Printf("Test failed: %v", err)
	} else {
		recipeJSON, _ := json.MarshalIndent(sampleRecipe, "", "  ")
		log.Println("Sample recipe generated successfully:")
		fmt.Println(string(recipeJSON))
	}

	// Set up HTTP routes
	mux := http.NewServeMux()

	// Main recipe endpoint
	mux.HandleFunc("POST /api/recipe", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		var input FoodInput
		if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(ErrorResponse{
				Error:   "Invalid JSON",
				Message: "Please provide valid JSON input",
			})
			return
		}

		recipe, err := foodRecipeFlow.Run(r.Context(), &input)
		if err != nil {
			log.Printf("Error generating recipe: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(ErrorResponse{
				Error:   "Recipe Generation Failed",
				Message: err.Error(),
			})
			return
		}

		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(recipe)
	})

	// Health check endpoint
	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"status":  "healthy",
			"service": "Food Recipe API",
		})
	})

	// API documentation endpoint
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]interface{}{
			"service": "Food Recipe API",
			"version": "1.0.0",
			"endpoints": map[string]interface{}{
				"POST /api/recipe": map[string]interface{}{
					"description": "Generate a recipe for a given food name",
					"input": map[string]string{
						"foodName":            "Name of the food (required)",
						"dietaryRestrictions": "Optional dietary restrictions",
						"difficulty":          "Optional difficulty level (easy, medium, hard)",
						"servingSize":         "Optional number of servings",
					},
				},
				"GET /health": "Health check endpoint",
			},
			"example_request": map[string]interface{}{
				"foodName":            "Chicken Tikka Masala",
				"dietaryRestrictions": "gluten-free",
				"difficulty":          "medium",
				"servingSize":         6,
			},
		})
	})

	// Genkit flow endpoint (for development/testing)
	mux.HandleFunc("POST /foodRecipeFlow", genkit.Handler(foodRecipeFlow))

	// Start the server
	port := "8080"

	log.Printf("🚀 Food Recipe API starting on http://localhost:%s", port)
	log.Printf("📖 API Documentation: GET http://localhost:%s/", port)
	log.Printf("🍳 Recipe endpoint: POST http://localhost:%s/api/recipe", port)
	log.Printf("❤️  Health check: GET http://localhost:%s/health", port)
	log.Printf("🔧 Genkit flow (dev): POST http://localhost:%s/foodRecipeFlow", port)

	log.Fatal(server.Start(ctx, "127.0.0.1:"+port, mux))
}

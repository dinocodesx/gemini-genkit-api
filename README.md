<img width="1200" height="630" alt="image" src="https://github.com/user-attachments/assets/dc5a0d1f-a372-49ea-b6a9-f6b18970feb3" />

# 🚀 Gemini Genkit API

Building Firebase Genkit APIs using TypeScript and Golang with Google's Gemini AI models. This project features a creative **Restaurant Menu Generator** that creates themed restaurant menus based on your specifications!

## 🌟 Features

- **TypeScript Implementation**: Restaurant menu generator using Firebase Genkit
- **Go Implementation**: Coming soon!
- **Google Gemini Integration**: Powered by Gemini 2.5 Flash model
- **Creative AI Outputs**: Generate complete restaurant menus with themed items, descriptions, and pricing
- **Interactive UI**: Built-in Genkit developer UI for testing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (recommended) or npm
- **Go** (v1.24.1 or higher)
- **Google AI API Key** (Gemini)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dinocodesx/gemini-genkit-api.git
cd gemini-genkit-api
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Google AI API Key for Gemini
GOOGLE_API_KEY=your_google_ai_api_key_here
```

**To get your Google AI API Key:**

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

### 3. TypeScript Setup

Navigate to the TypeScript directory and install dependencies:

```bash
cd ts
pnpm install  # or npm install
```

### 4. Go Setup (Optional)

Navigate to the Go directory and install dependencies:

```bash
cd go
go mod tidy
```

## 🏃‍♂️ Running the Applications

### TypeScript Application

#### Option 1: Run the Console Application

```bash
cd ts
pnpm dev
```

This will execute the restaurant menu generator with the default example and output a complete menu to the console.

#### Option 2: Use the Interactive Genkit UI (Recommended)

```bash
cd ts
pnpm genkit:ui
```

This starts the Genkit developer UI at `http://localhost:4000` where you can:

- Test the `restaurantMenuGeneratorFlow` interactively
- View detailed request/response data
- Experiment with different inputs
- Debug and monitor your flows

### Go Application

```bash
cd go
go run main.go
```

## 🎯 Usage Examples

### Example Input JSON

When using the Genkit UI or calling the flow programmatically, use this JSON structure:

#### Space Diner Theme

```json
{
  "name": "The Cosmic Cantina",
  "theme": "intergalactic space diner with retro-futuristic vibes",
  "cuisineType": "fusion comfort food",
  "priceRange": "mid-range",
  "atmosphere": "quirky and family-friendly with neon lights and space memorabilia",
  "specialFeature": "all dishes are served on LED-lit plates and the waitstaff wear space suits"
}
```

#### Pirate Tavern Theme

```json
{
  "name": "The Rusty Anchor",
  "theme": "pirate tavern with nautical adventures",
  "cuisineType": "seafood and hearty pub food",
  "priceRange": "budget",
  "atmosphere": "rowdy and adventurous with wooden barrels and treasure maps",
  "specialFeature": "meals are served in treasure chests and drinks come in skull mugs"
}
```

#### Medieval Castle Theme

```json
{
  "name": "Dragon's Den Feast Hall",
  "theme": "medieval castle dining with knights and dragons",
  "cuisineType": "European medieval fare",
  "priceRange": "upscale",
  "atmosphere": "grand and majestic with stone walls and candlelight",
  "specialFeature": "waiters dress as knights and meals are announced with a horn"
}
```

#### Minimalist Zen Theme

```json
{
  "name": "Zen Garden Bistro",
  "theme": "minimalist zen garden",
  "cuisineType": "Japanese fusion",
  "priceRange": "fine-dining",
  "atmosphere": "peaceful and serene"
}
```

### Input Schema

| Field            | Type   | Required | Description                                                |
| ---------------- | ------ | -------- | ---------------------------------------------------------- |
| `name`           | string | ✅       | Name of the restaurant                                     |
| `theme`          | string | ✅       | Restaurant theme or concept                                |
| `cuisineType`    | string | ✅       | Type of cuisine                                            |
| `priceRange`     | enum   | ✅       | `"budget"`, `"mid-range"`, `"upscale"`, or `"fine-dining"` |
| `atmosphere`     | string | ✅       | Atmosphere or vibe description                             |
| `specialFeature` | string | ❌       | Special feature or gimmick (optional)                      |

### Expected Output

The generator creates a complete restaurant menu including:

- **Restaurant Details**: Name, tagline, ambiance description
- **Menu Sections**: Appetizers, mains, desserts, beverages
- **Menu Items**: Creative names, detailed descriptions, themed pricing
- **Specialties**: Chef's special dishes (optional)
- **Fun Elements**: Amusing restaurant facts and themed wordplay

## 🔧 Development

### Project Structure

```
gemini-genkit-api/
├── ts/                     # TypeScript implementation
│   ├── index.ts           # Main restaurant menu generator
│   ├── package.json       # Dependencies and scripts
│   └── tsconfig.json      # TypeScript configuration
├── go/                    # Go implementation
│   ├── main.go           # Go Genkit implementation
│   ├── go.mod            # Go module definition
│   └── go.sum            # Go dependencies
├── .env                  # Environment variables
└── README.md            # This file
```

### Available Scripts (TypeScript)

- `pnpm dev` - Run the application in development mode
- `pnpm genkit:ui` - Start the interactive Genkit UI
- `pnpm test` - Run tests (to be implemented)

### Customizing the Generator

You can modify the restaurant menu generator by:

1. **Adjusting the prompt** in `restaurantMenuGeneratorFlow`
2. **Modifying schemas** to add/remove fields
3. **Changing the AI model** configuration
4. **Adding new flow variations** for different restaurant types

## 🐛 Troubleshooting

### Common Issues

1. **API Key Issues**

   - Ensure your `GOOGLE_API_KEY` is correctly set in `.env`
   - Verify the API key has proper permissions

2. **Port Conflicts**

   - If port 4000 is in use, Genkit will automatically use the next available port

3. **Module Resolution**

   - Make sure you're using Node.js v18 or higher
   - Try deleting `node_modules` and running `pnpm install` again

4. **TypeScript Errors**
   - Ensure all dependencies are installed
   - Check that `tsx` is available for running TypeScript files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase Genkit](https://firebase.google.com/docs/genkit) for the amazing AI development framework
- [Google Gemini](https://ai.google.dev/) for the powerful AI models
- The open-source community for continuous inspiration

---

**Happy Coding! 🚀✨**

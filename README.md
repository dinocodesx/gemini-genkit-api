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
- **Gemini API Key**

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/dinocodesx/gemini-genkit-api.git
cd gemini-genkit-api
```

### 2. Environment Configuration

Run the bash command into your terminal to export the **Gemini API Key**:

```bash
export GEMINI_API_KEY="your_gemini_api_key_here"
```

**To get your Gemini API Key:**

1. Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. Create a new API key
3. Set up billng via GCP

### 3. Demo 1 - Go Setup

Navigate to the Go directory and install dependencies:

```bash
cd go
go mod tidy
```

### 4. Demo 2 - TypeScript Setup

Navigate to the TypeScript directory and install dependencies:

```bash
cd ts
pnpm install  # or npm install
```

## 🏃‍♂️ Running the Applications

### TypeScript Application

```bash
cd ts
pnpm genkit:ui
```

This starts the Genkit developer UI at `http://localhost:4000` where you can:

- Test the `restaurantMenuGeneratorFlow` interactively
- View detailed request/response data
- Experiment with different inputs
- Debug and monitor your flows

### Golang Application

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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Firebase Genkit](https://genkit.dev/) for the amazing AI development framework
- [Google Gemini](https://ai.google.dev/) for the powerful AI models
- The open-source community for continuous inspiration

---

**Happy Coding! 🚀✨**

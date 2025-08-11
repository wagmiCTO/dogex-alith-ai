# 🐕 DogEx - DOGE AI Trading Vibes API

> **Disclaimer: This is NOT financial advice! This is a fun AI-powered API that generates humorous trading "vibes" for entertainment purposes only. Always do your own research and never trade with money you can't afford to lose.**

A TypeScript Express API that combines AI-powered humor with real-time DOGE price data to generate entertaining trading position suggestions and analyze your current positions with pure "vibes only" commentary.

## 🚀 Features

- **AI Trading Vibes**: Get random DOGE trading position suggestions with high leverage scenarios
- **Position Analysis**: Analyze your current DOGE positions with AI-generated humorous commentary
- **Real-time DOGE Price**: Fetches current DOGE/USDT price from Binance API
- **Risk Assessment**: Calculates distance to liquidation and risk levels
- **Leverage Detection**: Automatically extracts leverage from AI responses
- **CORS Enabled**: Ready for frontend integration

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **AI**: Alith library with Groq's Llama3-70B model
- **APIs**: Binance API for DOGE price data
- **Deployment**: Railway-ready configuration

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- Groq API key

## 🔧 Installation

1. **Clone the repository**
```bash
git clone https://github.com/romangordeew/dogex-alith-ai.git
cd dogex-alith-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3001
```

4. **Development**
```bash
npm run dev
```

5. **Production Build**
```bash
npm run build
npm start
```

## 🌐 API Endpoints

### `GET /`
Returns a welcome message with current DOGE price.

**Response:**
```
Hello DogEx - DOGE AI Trading Vibes. Fook loses and vibes only! Current DOGE price: $0.123456
```

### `GET /position`
Generates a random AI trading position suggestion for DOGE.

**Response:**
```json
{
  "leverage": 50,
  "position": "Long DOGE at $0.12 with 50x leverage - pure degen vibes, moon mission activated! 🚀",
  "dogePrice": 0.123456
}
```

### `POST /analyze`
Analyzes your current DOGE position with AI commentary.

**Request Body:**
```json
{
  "positionSize": 1000,
  "entryPrice": 0.12,
  "liquidationPrice": 0.10,
  "currentPrice": 0.125,
  "pnlSize": 41.67
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "aiAdvice": "Your LONG DOGE is printing money, 20.0% from liquidation - LOW risk vibes, hold tight and ride the wave! 🌊",
    "timestamp": "2025-08-11T10:30:00.000Z"
  }
}
```

## 🎯 Trading Prompts

The API uses a variety of humorous prompts to generate trading suggestions:
- Junior vibe trader scenarios with 50x leverage
- Random crypto positions with high leverage
- Gut feeling recommendations
- Degen trader perspectives
- Pure vibes-only suggestions

## 📊 Position Analysis Features

- **Risk Level Calculation**: LOW (<25%), MEDIUM (10-25%), HIGH (<10%) distance to liquidation
- **Position Type Detection**: Automatically determines LONG/SHORT positions
- **PnL Status**: Identifies if position is "printing" or "bleeding"
- **Humorous Commentary**: AI generates entertaining position analysis

## 🚀 Deployment

### Railway Deployment
This project is configured for Railway deployment:

1. Connect your GitHub repository to Railway
2. Set the `GROQ_API_KEY` environment variable
3. Railway will automatically build and deploy using the provided configuration

### Manual Deployment
```bash
npm run build
npm start
```

## 📁 Project Structure

```
dogex-alith-ai/
├── src/
│   └── index.ts          # Main application file
├── dist/                 # Compiled JavaScript (generated)
├── llm_logs/            # AI model logs
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── biome.json          # Code formatting configuration
├── Procfile            # Railway deployment config
├── railway.json        # Railway build configuration
└── README.md           # This file
```

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for AI model access | Yes |
| `PORT` | Server port (defaults to 3001) | No |

## 🧪 Development Scripts

```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm start           # Start production server
npm run railway:build # Railway build command
npm run railway:start # Railway start command
```

## 🎨 Example Usage

### Get a Random Trading Vibe
```bash
curl http://localhost:3001/position
```

### Analyze Your Position
```bash
curl -X POST http://localhost:3001/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "positionSize": 1000,
    "entryPrice": 0.12,
    "liquidationPrice": 0.10,
    "currentPrice": 0.125,
    "pnlSize": 41.67
  }'
```

## ⚠️ Important Notes

- **Entertainment Only**: This API is for entertainment and educational purposes
- **Not Financial Advice**: Never make trading decisions based on AI-generated "vibes"
- **High Risk**: Cryptocurrency trading with leverage is extremely risky
- **Rate Limits**: Be mindful of API rate limits from external services

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

**Remember: Only invest what you can afford to lose, and always do your own research! 🚀🐕**

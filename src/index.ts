import 'dotenv/config';
import { Agent } from "alith";
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const agent = new Agent({
    model: "llama3-70b-8192",
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: "https://api.groq.com/openai/v1",
});

// Function to fetch current DOGE price from Binance
async function getCurrentDogePrice() {
    try {
        const response = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=DOGEUSDT');
        return Number.parseFloat(response.data.price);
    } catch (error) {
        console.error('Error fetching DOGE price:', error);
        return null;
    }
}

const tradingPrompts = [
    "I'm a junior vibe trader that wants to earn on dogecoin with 50x leverage and 1 min chart. What position should I take rn? Not financial advice, just vibes. in one sentence",
    "Give me a random crypto trading position for DOGE with high leverage. Pure vibes, no financial advice. One sentence only.",
    "What's your gut feeling on DOGE right now? Long or short with 50x? Just vibes, one sentence.",
    "Random DOGE position suggestion with crazy leverage? Not advice, just pure trader vibes. One sentence.",
    "If you were a degen trader looking at DOGE charts right now, what would you do? Vibes only, one sentence."
];

const app = express();

// Middleware
app.use(cors({
    origin: true, // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

app.get('/', async (_req, res) => {
    try {
        const dogePrice = await getCurrentDogePrice();
        const priceInfo = dogePrice ? ` Current DOGE price: $${dogePrice.toFixed(6)}` : '';
        res.send(`Hello DogEx - DOGE AI Trading Vibes. Fook loses and vibes only!${priceInfo}`);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        });
    }
});

app.get('/position', async (_req, res) => {
    try {
        const dogePrice = await getCurrentDogePrice();
        const priceInfo = dogePrice ? ` Current DOGE price is $${dogePrice.toFixed(6)}.` : '';

        const randomPrompt = tradingPrompts[Math.floor(Math.random() * tradingPrompts.length)] + priceInfo;
        const position = await agent.prompt(randomPrompt);
        let leverage = 50;
        const leverageMatch = position.match(/(\d+)x/i);
        if (leverageMatch) {
            const extractedLeverage = Number(leverageMatch[1]);
            if (extractedLeverage >= 1 && extractedLeverage <= 100) {
                leverage = extractedLeverage;
            }
        }
        res.json({
            leverage: leverage,
            position: position,
            dogePrice: dogePrice
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        });
    }
});

app.post('/analyze', async (req, res) => {
    try {
        const { positionSize, entryPrice, liquidationPrice, currentPrice, pnlSize } = req.body;

        // Validate required fields
        if (!positionSize || !entryPrice || !liquidationPrice || !currentPrice || pnlSize === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: positionSize, entryPrice, liquidationPrice, currentPrice, pnlSize',
                timestamp: new Date().toISOString()
            });
        }

        // Calculate position metrics
        const distanceToLiquidation = Math.abs((currentPrice - liquidationPrice) / currentPrice) * 100;
        const isLong = currentPrice > entryPrice ? (pnlSize > 0) : (pnlSize < 0);
        const positionType = isLong ? "LONG" : "SHORT";
        const riskLevel = distanceToLiquidation < 10 ? "HIGH" : distanceToLiquidation < 25 ? "MEDIUM" : "LOW";

        // Create analysis prompt
        const funnyPrompts = [
            `Your ${positionType} DOGE position is ${pnlSize >= 0 ? 'printing' : 'bleeding'}, ${distanceToLiquidation.toFixed(1)}% from liquidation - ${riskLevel} risk vibes only, one sentence!`,

            `DOGE ${positionType}: Entry $${entryPrice}, now $${currentPrice}, liq at $${liquidationPrice} - ${riskLevel} risk, pure vibes in one sentence!`,

            `Your ${positionSize} DOGE ${positionType} is ${pnlSize >= 0 ? 'mooning' : 'cratering'}, ${distanceToLiquidation.toFixed(1)}% from rekt - vibe check in one sentence!`,

            `DOGE ${positionType} from $${entryPrice} to $${currentPrice}, PnL: ${pnlSize >= 0 ? '+' : ''}$${pnlSize}, ${riskLevel} risk - one sentence vibe only!`,

            `Your DOGE ${positionType} at $${currentPrice}, ${distanceToLiquidation.toFixed(1)}% from liquidation, ${riskLevel} risk ${pnlSize >= 0 ? 'gains' : 'pain'} - one sentence vibes!`
        ];

        const randomPrompt = funnyPrompts[Math.floor(Math.random() * funnyPrompts.length)];
        const analysis = await agent.prompt(randomPrompt);

        res.json({
            success: true,
            analysis: {
                aiAdvice: analysis,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString()
        });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🦊 Express server is running at localhost:${PORT}`);
    console.log(`📈 Get random AI trading position at: http://localhost:${PORT}/position`);
    console.log(`🔍 Analyze your position at: http://localhost:${PORT}/analyze (POST)`);
});

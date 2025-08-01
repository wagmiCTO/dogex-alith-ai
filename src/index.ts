import 'dotenv/config';
import { Agent } from "alith";
import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors';
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

const app = new Elysia()
    .use(cors({
        origin: true, // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }))
    .get('/', async () => {
        const dogePrice = await getCurrentDogePrice();
        const priceInfo = dogePrice ? ` Current DOGE price: $${dogePrice.toFixed(6)}` : '';
        return `Hello DogEx - DOGE AI Trading Vibes. Fook loses and vibes only!${priceInfo}`;
    })
    .get('/position', async () => {
        try {
            const dogePrice = await getCurrentDogePrice();
            const priceInfo = dogePrice ? ` Current DOGE price is $${dogePrice.toFixed(6)}.` : '';

            const randomPrompt = tradingPrompts[Math.floor(Math.random() * tradingPrompts.length)] + priceInfo;
            const position = await agent.prompt(randomPrompt);
            const leverage = Math.floor(Math.random() * 91) + 10; // Random number between 10-100

            return {
                leverage: leverage,
                position: position,
                dogePrice: dogePrice
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString()
            };
        }
    })
    .post('/analyze', async ({ body }: { body: any }) => {
        try {
            const { positionSize, entryPrice, liquidationPrice, currentPrice, pnlSize } = body;

            // Validate required fields
            if (!positionSize || !entryPrice || !liquidationPrice || !currentPrice || pnlSize === undefined) {
                return {
                    success: false,
                    error: 'Missing required fields: positionSize, entryPrice, liquidationPrice, currentPrice, pnlSize',
                    timestamp: new Date().toISOString()
                };
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

            return {
                success: true,
                analysis: {
                    aiAdvice: analysis,
                    timestamp: new Date().toISOString()
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString()
            };
        }
    });

// For Railway's WebStandard environment, export the fetch handler
export default app;

// For local development, check if we're not in a WebStandard environment
if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
    const port = process.env.PORT || 3001;
    try {
        app.listen(port, () => {
            console.log(`🦊 Elysia is running at localhost:${port}`);
            console.log(`📈 Get random AI trading position at: http://localhost:${port}/position`);
            console.log(`🔍 Analyze your position at: http://localhost:${port}/analyze (POST)`);
        });
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
    } catch (error) {
        console.log('🌐 Running in WebStandard environment, using fetch export');
    }
}

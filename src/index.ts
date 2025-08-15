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
    "I'm a junior vibe trader that wants to earn on dogecoin with 50x leverage and 1 min chart. What position should I take rn? Drop some technical analysis wisdom with the memes. One sentence max!",

    "Give me a random crypto trading position for DOGE with high leverage. Include a fun fact about leverage or trading psychology. Pure vibes + education in one sentence.",

    "What's your gut feeling on DOGE right now? Long or short with crazy leverage? Explain why like you're teaching a golden retriever about trading. One sentence vibes.",

    "Random DOGE position suggestion with insane leverage? Add a trading lesson disguised as a meme. Educational degeneracy in one sentence!",

    "If you were a degen trader looking at DOGE charts right now, what would you do? Include why most traders lose money. Wise vibes only, one sentence.",

    "DOGE trading position with maximum chaos energy? Throw in a risk management tip like you're a cool older sibling. One sentence of wisdom!",

    "What would a trading bot dream about for DOGE? Include a psychological bias that destroys traders. Philosophical vibes in one sentence!",

    "Give me a DOGE position that would make Elon tweet about it. Add why emotion kills profits. Meme wisdom in one sentence!",

    "Random DOGE leverage play with the energy of a caffeinated day trader? Include why 90% of traders fail. Brutal honesty in one sentence!",

    "What position would make Warren Buffett cry but crypto Twitter celebrate? Add a lesson about FOMO. Educational chaos in one sentence!"
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

        const funnyGreetings = [
            "🐕 Welcome to DogEx - Where DOGE dreams meet leverage nightmares!",
            "🚀 DogEx: Teaching traders that 'YOLO' is not a risk management strategy!",
            "📈 Welcome to the school of hard knocks and harder liquidations!",
            "🎭 DogEx: Where comedy meets tragedy in the crypto markets!",
            "🧠 Enter the matrix of memes and margin calls!"
        ];

        const randomGreeting = funnyGreetings[Math.floor(Math.random() * funnyGreetings.length)];
        res.send(`${randomGreeting}${priceInfo} 🎯 Pro tip: The house always wins, but at least we make it educational!`);
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

        // Create analysis prompt with educational humor
        const funnyPrompts = [
            `Your ${positionType} DOGE position is ${pnlSize >= 0 ? 'printing' : 'bleeding'}, ${distanceToLiquidation.toFixed(1)}% from liquidation - ${riskLevel} risk! Roast my position but teach me something about risk management. One sentence!`,

            `DOGE ${positionType}: Entry $${entryPrice}, now $${currentPrice}, liq at $${liquidationPrice} - ${riskLevel} risk! Give me wisdom disguised as trader comedy. One sentence of brutal truth!`,

            `Your ${positionSize} DOGE ${positionType} is ${pnlSize >= 0 ? 'mooning' : 'cratering'}, ${distanceToLiquidation.toFixed(1)}% from rekt - ${riskLevel} risk! Channel your inner trading guru and explain why this happened like I'm 5. One sentence!`,

            `DOGE ${positionType} from $${entryPrice} to $${currentPrice}, PnL: ${pnlSize >= 0 ? '+' : ''}$${pnlSize}, ${riskLevel} risk! Break down my trading psychology like a therapist who trades crypto. One sentence of wisdom!`,

            `Your DOGE ${positionType} at $${currentPrice}, ${distanceToLiquidation.toFixed(1)}% from liquidation, ${riskLevel} risk ${pnlSize >= 0 ? 'gains' : 'pain'}! Explain what went right/wrong using trading memes and education. One sentence!`,

            `DOGE ${positionType} reality check: ${pnlSize >= 0 ? 'Winning' : 'Losing'} $${Math.abs(pnlSize)}, ${distanceToLiquidation.toFixed(1)}% from rekt! Give me a trading lesson wrapped in sarcasm and hope. One sentence!`,

            `Your ${positionSize} DOGE ${positionType} journey from $${entryPrice} to $${currentPrice} - ${riskLevel} risk vibes! Analyze this like a wise degen who's seen everything. Educational roast in one sentence!`,

            `DOGE ${positionType} status: ${pnlSize >= 0 ? 'Chad energy' : 'Pain train'}, ${distanceToLiquidation.toFixed(1)}% from game over! Explain the market psychology behind this move. One sentence of truth!`,

            `Position update: DOGE ${positionType} with ${riskLevel} risk, ${pnlSize >= 0 ? 'printing' : 'burning'} money! Break down why leverage is both friend and enemy. One sentence lesson!`,

            `Your DOGE ${positionType} adventure: Entry $${entryPrice}, current $${currentPrice}, liquidation lurking at $${liquidationPrice}! Explain position sizing wisdom through crypto comedy. One sentence!`
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
    console.log(`🎭 Educational comedy meets crypto chaos!`);
});

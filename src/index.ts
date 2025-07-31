import 'dotenv/config';
import { Agent } from "alith";
import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import { cors } from '@elysiajs/cors';

const agent = new Agent({
    model: "llama3-70b-8192",
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: "https://api.groq.com/openai/v1",
});

const tradingPrompts = [
    "I'm a junior vibe trader that wants to earn on dogecoin with 50x leverage and 1 min chart. What position should I take rn? Not financial advice, just vibes. in one sentence",
    "Give me a random crypto trading position for DOGE with high leverage. Pure vibes, no financial advice. One sentence only.",
    "What's your gut feeling on DOGE right now? Long or short with 50x? Just vibes, one sentence.",
    "Random DOGE position suggestion with crazy leverage? Not advice, just pure trader vibes. One sentence.",
    "If you were a degen trader looking at DOGE charts right now, what would you do? Vibes only, one sentence."
];

new Elysia({ adapter: node() })
    .use(cors({
        origin: true, // Allow all origins
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }))
    .get('/', () => 'Hello DogEx - DOGE AI Trading Vibes. Fook loses and vibes only!')
    .get('/position', async () => {
        try {
            const randomPrompt = tradingPrompts[Math.floor(Math.random() * tradingPrompts.length)];
            const position = await agent.prompt(randomPrompt);
            const leverage = Math.floor(Math.random() * 91) + 10; // Random number between 10-100

            return {
                leverage: leverage,
                position: position
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error occurred',
                timestamp: new Date().toISOString()
            };
        }
    })
    .listen(3001, ({ hostname, port }: { hostname: string; port: number }) => {
        console.log(
            `🦊 Elysia is running at ${hostname}:${port}`
        )
        console.log(`📈 Get random AI trading position at: http://${hostname}:${port}/position`)
    })

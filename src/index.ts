import 'dotenv/config';
import { Agent } from "alith";

const agent = new Agent({
    model: "llama3-70b-8192",
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: "https://api.groq.com/openai/v1",
});

console.log(await agent.prompt("I'm a junior vibe trader that wants to earn on dogecoin with 50x leverage and 1 min chart. What position should I take rn? Not financial advice, just vibes. in one sentence"));

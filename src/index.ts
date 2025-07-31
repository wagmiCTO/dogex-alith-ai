import 'dotenv/config';
import { Agent } from "alith";

const agent = new Agent({
    model: "llama3-70b-8192",
    apiKey: process.env.GROQ_API_KEY,
    baseUrl: "https://api.groq.com/openai/v1",
});

console.log(await agent.prompt("what is the capital of France?"));

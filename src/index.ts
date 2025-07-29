import {Agent} from "alith";

/**
 * Get trading advice from Alice AI for Dogecoin
 * @param {number} value - The trading value/amount
 * @param {number} leverage - The leverage to use for trading
 * @returns {Promise<Object>} Trading advice from Alice
 */
async function getAliceTradingAdvice(value: number, leverage:number) {
    try {
        const agent = new Agent({
            apiKey: process.env.GEMINI_API_KEY,
            model: "gemini-1.5-pro",
            preamble: "You are Alice, an expert cryptocurrency trading advisor. You provide specific, actionable trading advice with clear entry/exit points and risk management strategies. You focus on technical analysis and market trends to give precise recommendations."
        });

        const tradingPrompt = `I want to trade Dogecoin (DOGE) on a 1-minute timeframe. My trading value is $${value} with ${leverage}x leverage. What's your trading advice? Should I buy, sell, or hold? Please provide specific entry/exit points and risk management advice.`;

        const advice = await agent.prompt(tradingPrompt);

        return {
            success: true,
            advice: advice,
            timestamp: new Date().toISOString(),
            parameters: {
                coin: 'DOGE',
                timeframe: '1min',
                value: value,
                leverage: leverage
            }
        };
    } catch (error) {
        // @ts-ignore
        console.error('Error getting Alice trading advice:', error.message);
        return {
            success: false,
            // @ts-ignore
            error: error.message,
            timestamp: new Date().toISOString(),
            parameters: {
                coin: 'DOGE',
                timeframe: '1min',
                value: value,
                leverage: leverage
            }
        };
    }
}

// Example usage
async function main() {
    console.log('🤖 Alice Dogecoin Trader Started');
    console.log('===============================');

    // Example call with $100 value and 5x leverage
    const advice = await getAliceTradingAdvice(100, 5);

    if (advice.success) {
        console.log('✅ Alice Trading Advice:');
        console.log('Coin:', advice.parameters.coin);
        console.log('Timeframe:', advice.parameters.timeframe);
        console.log('Value:', `$${advice.parameters.value}`);
        console.log('Leverage:', `${advice.parameters.leverage}x`);
        console.log('Timestamp:', advice.timestamp);
        console.log('\n📊 Advice:');
        console.log(advice.advice);
    } else {
        console.log('❌ Failed to get trading advice:');
        console.log('Error:', advice.error);
    }
}


// Run the example if this file is executed directly
if (require.main === module) {
    main().catch(console.error);
}
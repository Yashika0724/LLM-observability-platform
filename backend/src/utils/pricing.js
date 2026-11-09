// Price in USD per 1 million tokens
const prices = {
  "openai/gpt-4o": { input: 2.5, output: 10 },
  "openai/gpt-4o-mini": { input: 0.15, output: 0.6 },
  "meta-llama/llama-3.1-8b-instruct": { input: 0.02, output: 0.05 },
};

export function calculateCost(model, inputTokens, outputTokens) {
  const price = prices[model];
  if (!price) return 0; // free or unknown model

  return (inputTokens * price.input + outputTokens * price.output) / 1000000;
}

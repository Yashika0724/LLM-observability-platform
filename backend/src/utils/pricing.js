// Price in USD per 1 million tokens
const prices = {
  "openai/gpt-4o": { input: 2.5, output: 10 },
  "openai/gpt-4o-mini": { input: 0.15, output: 0.6 },
  "meta-llama/llama-3.1-8b-instruct": { input: 0.02, output: 0.05 },
};

// Returns the cost in USD, or null when the model's price is not known
export function calculateCost(model, inputTokens, outputTokens) {
  if (model?.endsWith(":free")) return 0; // OpenRouter free models really cost nothing

  const price = prices[model];
  if (!price) return null; // unknown, so don't pretend it is $0

  return (inputTokens * price.input + outputTokens * price.output) / 1000000;
}

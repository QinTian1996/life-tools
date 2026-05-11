import { deepseek, createDeepSeek } from '@ai-sdk/deepseek';
import { createAnthropic } from '@ai-sdk/anthropic';

const minimaxProvider = createAnthropic({
  baseURL: 'https://api.minimaxi.com/anthropic/v1',
  apiKey: process.env.MINIMAX_API_KEY || '',
  headers: { 'Content-Type': 'application/json' },
});

export const minimax = minimaxProvider('MiniMax-M2.7-highspeed');
export const dsV4Flash = deepseek('deepseek-v4-flash');
export const dsV4Pro = deepseek('deepseek-v4-pro');

export const defaultModel = minimax;

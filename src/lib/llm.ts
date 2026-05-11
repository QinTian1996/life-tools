import { deepseek } from '@ai-sdk/deepseek';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';

const minimaxProvider = createAnthropic({
  baseURL: 'https://api.minimaxi.com/anthropic/v1',
  apiKey: process.env.MINIMAX_API_KEY || '',
});

const kimiProvider = createOpenAI({
  baseURL: 'https://api.moonshot.cn/v1',
  apiKey: process.env.KIMI_API_KEY || '',
});

export const minimax = minimaxProvider('MiniMax-M2.7-highspeed');
export const kimi = kimiProvider('kimi-latest');
export const dsV4Flash = deepseek('deepseek-v4-flash');
export const dsV4Pro = deepseek('deepseek-v4-pro');

export const defaultModel = kimi;

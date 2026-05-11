import { deepseek } from '@ai-sdk/deepseek';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const minimaxProvider = createAnthropic({
  baseURL: 'https://api.minimaxi.com/anthropic/v1',
  apiKey: process.env.MINIMAX_API_KEY || '',
});

const kimiProvider = createOpenAICompatible({
  baseURL: 'https://api.moonshot.cn/v1',
  apiKey: process.env.KIMI_API_KEY || '',
  name: 'kimi',
});

export const minimax = minimaxProvider('MiniMax-M2.7-highspeed');
export const kimi = kimiProvider('kimi-k2.5');
export const dsV4Flash = deepseek('deepseek-v4-flash');
export const dsV4Pro = deepseek('deepseek-v4-pro');

export const defaultModel = kimi;

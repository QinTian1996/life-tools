import { generateObject } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { z } from 'zod';
import type { BirthInput } from '@/lib/bazi/types';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const maxDuration = 30;

function mapErrorToCode(error: unknown): { error: string; code: string } {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  if (lower.includes('rate')) return { error: 'Rate limit exceeded', code: 'RATE_LIMITED' };
  if (lower.includes('context') || lower.includes('token')) return { error: 'Context length exceeded', code: 'CONTEXT_OVERFLOW' };
  if (lower.includes('invalid') || lower.includes('validation')) return { error: 'Invalid request', code: 'INVALID_REQUEST' };
  return { error: 'Model error', code: 'MODEL_ERROR' };
}

function buildFourPillarsText(input: BirthInput, bazi: {
  yearPillar: { stemName: string; branchName: string };
  monthPillar: { stemName: string; branchName: string };
  dayPillar: { stemName: string; branchName: string };
  hourPillar: { stemName: string; branchName: string };
}): string {
  return `${bazi.yearPillar.stemName}${bazi.yearPillar.branchName}年 ${bazi.monthPillar.stemName}${bazi.monthPillar.branchName}月 ${bazi.dayPillar.stemName}${bazi.dayPillar.branchName}日 ${bazi.hourPillar.stemName}${bazi.hourPillar.branchName}时`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as BirthInput;
    if (!body.year || !body.month || !body.day || !body.gender) {
      return Response.json({ error: 'Missing required fields', code: 'INVALID_REQUEST' }, { status: 400 });
    }

    const { computeBazi } = await import('@/lib/bazi/calculator');
    const baziResult = computeBazi(body);
    const fourPillarsText = buildFourPillarsText(body, baziResult);

    const roastPrompt = fs.readFileSync(
      path.join(process.cwd(), 'src/lib/bazi/prompts', 'roasts.txt'), 'utf-8'
    );
    const prompt = roastPrompt
      .replace('{fourPillars}', fourPillarsText)
      .replace('{gender}', body.gender === 'male' ? '男' : '女')
      .replace('{name}', body.name || '当事人');

    const { object } = await generateObject({
      model: deepseek('deepseek-v4-pro'),
      prompt,
      schema: z.object({ roasts: z.array(z.string()) }),
      maxOutputTokens: 1000,
    });

    return Response.json({ roasts: object.roasts });
  } catch (error) {
    const { error: errorMessage, code } = mapErrorToCode(error);
    return Response.json({ error: errorMessage, code }, { status: 500 });
  }
}

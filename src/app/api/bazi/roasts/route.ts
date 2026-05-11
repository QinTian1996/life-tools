import { generateText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import type { BirthInput } from '@/lib/bazi/types';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const maxDuration = 30;

function mapErrorToCode(error: unknown): { error: string; code: string } {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();

  if (lower.includes('rate')) {
    return { error: 'Rate limit exceeded', code: 'RATE_LIMITED' };
  }
  if (lower.includes('context') || lower.includes('token')) {
    return { error: 'Context length exceeded', code: 'CONTEXT_OVERFLOW' };
  }
  if (lower.includes('invalid') || lower.includes('validation')) {
    return { error: 'Invalid request', code: 'INVALID_REQUEST' };
  }
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

function readPrompt(filename: string): string {
  return fs.readFileSync(
    path.join(process.cwd(), 'src/lib/bazi/prompts', filename),
    'utf-8'
  );
}

async function getRoasts(input: BirthInput, fourPillarsText: string): Promise<string[]> {
  const roastPrompt = readPrompt('roasts.txt');

  const prompt = roastPrompt
    .replace('{fourPillars}', fourPillarsText)
    .replace('{gender}', input.gender === 'male' ? '男' : '女')
    .replace('{name}', input.name || '当事人');

  const { text } = await generateText({
    model: deepseek('deepseek-v4-flash'),
    prompt,
    maxOutputTokens: 1000,
  });

  // Parse JSON array from response
  try {
    const cleaned = text.trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return JSON.parse(cleaned);
  } catch {
    return [text.trim()];
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as BirthInput;

    // Validate required fields
    if (!body.year || !body.month || !body.day || !body.gender) {
      return Response.json(
        { error: 'Missing required fields: year, month, day, gender', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // Import calculator to get four pillars text
    const { computeBazi } = await import('@/lib/bazi/calculator');
    const baziResult = computeBazi(body);
    const fourPillarsText = buildFourPillarsText(body, baziResult);

    const roasts = await getRoasts(body, fourPillarsText);

    return Response.json({ roasts });
  } catch (error) {
    const { error: errorMessage, code } = mapErrorToCode(error);
    return Response.json({ error: errorMessage, code }, { status: 500 });
  }
}

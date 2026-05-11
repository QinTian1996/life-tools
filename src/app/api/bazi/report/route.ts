import { generateText } from 'ai';
import { defaultModel } from '@/lib/llm';
import type { BirthInput } from '@/lib/bazi/types';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const maxDuration = 120;

function mapErrorToCode(error: unknown): { error: string; code: string } {
  const message = error instanceof Error ? error.message : String(error);
  const lower = message.toLowerCase();
  if (lower.includes('rate')) return { error: 'Rate limit exceeded', code: 'RATE_LIMITED' };
  if (lower.includes('context') || lower.includes('token')) return { error: 'Context length exceeded', code: 'CONTEXT_OVERFLOW' };
  if (lower.includes('invalid') || lower.includes('validation')) return { error: 'Invalid request', code: 'INVALID_REQUEST' };
  return { error: 'Model error', code: 'MODEL_ERROR' };
}

function buildFourPillarsText(bazi: {
  yearPillar: { stemName: string; branchName: string };
  monthPillar: { stemName: string; branchName: string };
  dayPillar: { stemName: string; branchName: string };
  hourPillar: { stemName: string; branchName: string };
  dayun: Array<{ age: number; stemName: string; branchName: string }>;
  shiShen: { yearStem: string; monthStem: string; dayStem: string; hourStem: string };
}): string {
  return `年柱：${bazi.yearPillar.stemName}${bazi.yearPillar.branchName}
月柱：${bazi.monthPillar.stemName}${bazi.monthPillar.branchName}
日柱：${bazi.dayPillar.stemName}${bazi.dayPillar.branchName}
时柱：${bazi.hourPillar.stemName}${bazi.hourPillar.branchName}
大运：${bazi.dayun.slice(0, 4).map(d => `${d.age}岁${d.stemName}${d.branchName}`).join('、')}
十神：年干${bazi.shiShen.yearStem}、月干${bazi.shiShen.monthStem}、日干${bazi.shiShen.dayStem}、时干${bazi.shiShen.hourStem}`;
}

async function generateReport(promptFile: string, fourPillarsText: string, input: BirthInput): Promise<string> {
  const prompt = fs.readFileSync(
    path.join(process.cwd(), 'src/lib/bazi/prompts', promptFile), 'utf-8'
  );
  const filledPrompt = prompt.replace('{fourPillars}', fourPillarsText)
    .replace('{gender}', input.gender === 'male' ? '男' : '女')
    .replace('{name}', input.name || '当事人');

  const { text } = await generateText({
    model: defaultModel,
    prompt: filledPrompt,
    maxOutputTokens: 8000,
  });

  return text.trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as BirthInput;
    if (!body.year || !body.month || !body.day || !body.gender) {
      return Response.json({ error: 'Missing required fields', code: 'INVALID_REQUEST' }, { status: 400 });
    }

    const { computeBazi } = await import('@/lib/bazi/calculator');
    const baziResult = computeBazi(body);
    const fourPillarsText = buildFourPillarsText(baziResult);

    const [professional, detailed] = await Promise.all([
      generateReport('report-professional.txt', fourPillarsText, body),
      generateReport('report-detailed.txt', fourPillarsText, body),
    ]);

    return Response.json({ professional, detailed });
  } catch (error) {
    const { error: errorMessage, code } = mapErrorToCode(error);
    return Response.json({ error: errorMessage, code }, { status: 500 });
  }
}

import { streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_MESSAGES = 20;
const MAX_TOKENS = 1024;

interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
}

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

export async function POST(req: Request) {
  try {
    const body: unknown = await req.json();
    const { messages, temperature } = body as ChatRequest;

    // D-02: Strict validation - messages required and non-empty
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'messages must be a non-empty array', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    // D-02: Each message must have role and content as strings
    for (const msg of messages) {
      if (!msg || typeof msg !== 'object') {
        return Response.json(
          { error: 'Each message must be an object', code: 'INVALID_REQUEST' },
          { status: 400 }
        );
      }
      const { role, content } = msg as { role?: unknown; content?: unknown };
      if (typeof role !== 'string' || typeof content !== 'string') {
        return Response.json(
          { error: 'Each message must have role and content as strings', code: 'INVALID_REQUEST' },
          { status: 400 }
        );
      }
    }

    // D-05: Validate temperature if provided
    if (temperature !== undefined) {
      if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
        return Response.json(
          { error: 'temperature must be a number between 0 and 2', code: 'INVALID_REQUEST' },
          { status: 400 }
        );
      }
    }

    // Window messages to last 20 (cost control)
    const windowedMessages = messages.slice(-MAX_MESSAGES);

    const result = streamText({
      model: deepseek('deepseek-v4-flash'),
      messages: windowedMessages,
      maxTokens: MAX_TOKENS,
      ...(temperature !== undefined && { temperature }),
    });

    // D-04: AI SDK standard stream protocol with onError sanitization
    return result.toUIMessageStreamResponse({
      onError: ({ error }) => {
        return mapErrorToCode(error);
      },
    });
  } catch {
    // Parse error or unexpected error
    return Response.json(
      { error: 'Invalid request body', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }
}

// D-07, D-08: GET for health/liveness probes
export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return Response.json(
      { status: 'unhealthy', error: 'DEEPSEEK_API_KEY not configured' },
      { status: 503 }
    );
  }

  // D-08: Verify actual DeepSeek API connectivity
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      return Response.json(
        { status: 'unhealthy', error: 'DeepSeek API unreachable' },
        { status: 503 }
      );
    }

    return Response.json({ status: 'healthy' });
  } catch {
    return Response.json(
      { status: 'unhealthy', error: 'Failed to connect to DeepSeek API' },
      { status: 503 }
    );
  }
}

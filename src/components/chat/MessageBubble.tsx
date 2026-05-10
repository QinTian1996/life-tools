'use client';

import type { UIMessage, TextUIPart } from 'ai';

interface MessageBubbleProps {
  message: UIMessage;
}

function getTextContent(message: UIMessage): string {
  return message.parts
    .filter((part): part is TextUIPart => part.type === 'text')
    .map((part) => part.text)
    .join('');
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const content = getTextContent(message);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-lg ${
          message.role === 'assistant'
            ? 'bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-br-none'
            : 'bg-[var(--primary)] text-[var(--primary-foreground)] rounded-bl-none'
        }`}
      >
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    </div>
  );
}

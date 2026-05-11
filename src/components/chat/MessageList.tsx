'use client';

import { useEffect, useRef } from 'react';
import type { UIMessage } from 'ai';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const reversed = [...messages].reverse();

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTo({ top: 0, behavior: 'smooth' });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto flex flex-col-reverse px-4 py-4"
    >
      <div className="flex flex-col gap-3">
        {reversed.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-start mt-3">
          <div className="bg-[var(--secondary)] rounded-lg rounded-br-none px-4 py-3 flex gap-2 items-center">
            <span
              style={{ animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0s' }}
              className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full"
            />
            <span
              style={{ animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.16s' }}
              className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full"
            />
            <span
              style={{ animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '0.32s' }}
              className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full"
            />
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

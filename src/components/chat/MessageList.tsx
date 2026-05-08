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

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollHeight, scrollTop, clientHeight } = container;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom <= 100) {
      container.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto px-4 py-4">
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-orange-50 rounded-lg rounded-br-none px-4 py-3 flex gap-2 items-center">
              <span
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0s',
                }}
                className="inline-block w-2 h-2 bg-amber-600 rounded-full"
              />
              <span
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.16s',
                }}
                className="inline-block w-2 h-2 bg-amber-600 rounded-full"
              />
              <span
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.32s',
                }}
                className="inline-block w-2 h-2 bg-amber-600 rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}

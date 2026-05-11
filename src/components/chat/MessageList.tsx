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
  const pinned = useRef(true);

  const distFromBottom = () => {
    const el = containerRef.current;
    if (!el) return 0;
    return el.scrollHeight - el.scrollTop - el.clientHeight;
  };

  const scrollToBottom = (smooth: boolean) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    if (!isLoading) return;
    let raf = 0;
    const loop = () => {
      if (pinned.current) scrollToBottom(false);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isLoading]);

  useEffect(() => {
    if (messages.length > 0 && distFromBottom() <= 200) {
      pinned.current = true;
    }
    if (pinned.current) {
      scrollToBottom(true);
    }
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      onScroll={() => {
        const d = distFromBottom();
        if (d > 50) pinned.current = false;
        else if (d === 0) pinned.current = true;
      }}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start">
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

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
  const sentinelRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const prevLoading = useRef(false);

  const isAtBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 100;
  };

  const scrollToBottom = (smooth: boolean) => {
    if (smooth) {
      sentinelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } else {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    if (isLoading && !prevLoading.current) {
      userScrolledUp.current = !isAtBottom();
    }
    if (prevLoading.current && !isLoading) {
      userScrolledUp.current = false;
      scrollToBottom(true);
    }
    prevLoading.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    userScrolledUp.current = false;
    scrollToBottom(true);
  }, [messages.length]);

  useEffect(() => {
    if (!isLoading || userScrolledUp.current) return;
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const tick = () => {
      el.scrollTop = el.scrollHeight;
      raf = 0;
    };

    const observer = new MutationObserver(() => {
      if (!raf) raf = requestAnimationFrame(tick) as unknown as number;
    });

    observer.observe(el, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [isLoading]);

  return (
    <div
      ref={containerRef}
      onScroll={() => {
        userScrolledUp.current = !isAtBottom();
      }}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      <div className="flex flex-col gap-3">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        <div ref={sentinelRef} />

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

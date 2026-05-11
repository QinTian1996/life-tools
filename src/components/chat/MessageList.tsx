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
  const contentRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const prevLoading = useRef(false);

  const isAtBottom = () => {
    const el = containerRef.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight <= 100;
  };

  const scrollToBottom = (smooth: boolean) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      if (!userScrolledUp.current) {
        scrollToBottom(false);
      }
    });

    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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

  return (
    <div
      ref={containerRef}
      onScroll={() => {
        userScrolledUp.current = !isAtBottom();
      }}
      className="flex-1 overflow-y-auto px-4 py-4"
    >
      <div ref={contentRef} className="flex flex-col gap-3">
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

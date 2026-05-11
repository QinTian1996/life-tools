'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import type { UIMessage, TextUIPart } from 'ai';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: UIMessage[];
  isLoading: boolean;
}

function lastMessageText(messages: UIMessage[]): string {
  if (messages.length === 0) return '';
  const last = messages[messages.length - 1];
  return last.parts
    .filter((p): p is TextUIPart => p.type === 'text')
    .map((p) => p.text)
    .join('');
}

export default function MessageList({ messages, isLoading }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);

  const text = lastMessageText(messages);

  const scrollToBottom = (smooth: boolean) => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const { scrollHeight, scrollTop, clientHeight } = el;
    userScrolledUp.current = scrollHeight - scrollTop - clientHeight > 100;
  };

  useEffect(() => {
    if (!isLoading && messages.length > 0) {
      userScrolledUp.current = false;
      scrollToBottom(true);
    }
  }, [messages.length]);

  useLayoutEffect(() => {
    if (isLoading && !userScrolledUp.current) {
      scrollToBottom(false);
    }
  }, [text, isLoading]);

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
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
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0s',
                }}
                className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full"
              />
              <span
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.16s',
                }}
                className="inline-block w-2 h-2 bg-[var(--primary)] rounded-full"
              />
              <span
                style={{
                  animation: 'bounce 1.4s infinite ease-in-out both',
                  animationDelay: '0.32s',
                }}
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

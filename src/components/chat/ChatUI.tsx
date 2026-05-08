'use client';

import { useState, useMemo } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import type { UIMessage } from 'ai';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatUI() {
  const [input, setInput] = useState('');
  const [localError, setLocalError] = useState<Error | null>(null);

  const transport = useMemo(
    () => new DefaultChatTransport({ api: '/api/chat' }),
    [],
  );

  const { messages, status, error, sendMessage } = useChat({
    transport,
  });

  const isLoading = status === 'streaming';

  const handleSubmit = () => {
    if (!input.trim()) return;
    setLocalError(null);
    sendMessage({ text: input });
    setInput('');
  };

  const displayError = error ?? localError;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      <header className="bg-amber-600 text-white px-4 py-3 shadow-md">
        <h1 className="text-lg font-bold">聊天</h1>
      </header>

      <MessageList messages={messages satisfies UIMessage[]} isLoading={isLoading} />

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        error={displayError}
      />
    </div>
  );
}

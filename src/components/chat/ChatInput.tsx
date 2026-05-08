'use client';

import type { UIMessage } from 'ai';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error: Error | null;
}

export default function ChatInput({
  input,
  setInput,
  onSubmit,
  isLoading,
  error,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        onSubmit();
      }
    }
  };

  const handleSend = () => {
    if (!isLoading && input.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="border-t border-gray-100 p-4 bg-white">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-2 text-sm">
          {error.message || '发生错误，请重试'}
        </div>
      )}

      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="flex-1 border border-gray-200 rounded-lg px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 text-gray-800"
          rows={1}
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white rounded-lg font-medium transition-colors"
        >
          发送
        </button>
      </div>
    </div>
  );
}

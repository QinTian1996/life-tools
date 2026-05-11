'use client';

import { Button } from "@/components/ui/Button";

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
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-[var(--border)] p-4 bg-[var(--background)]">
      {error && (
        <div className="bg-[var(--destructive)] text-[var(--destructive-foreground)] border border-[var(--destructive)] px-4 py-2 rounded-lg mb-2 text-sm">
          {error.message || '发送失败，请重试'}
        </div>
      )}

      <div className="flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息..."
          className="flex-1 border border-[var(--input)] rounded-[var(--radius-md)] px-4 py-3 resize-none focus:outline-none focus:border-[var(--ring)] focus:ring-2 focus:ring-[var(--ring)] text-[var(--foreground)] bg-transparent"
          rows={1}
          disabled={isLoading}
        />
        <Button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          variant="primary"
          size="default"
        >
          发送
        </Button>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import PageLayout from '@/components/layout/PageLayout';

const COMMIT = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

export default function Home() {
  return (
    <PageLayout>
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-[family-name:var(--font-brand)] font-semibold text-[var(--foreground)] mb-4">喵十七的工具箱 🔧</h1>
        <p className="text-[var(--muted-foreground)] text-lg mb-8">给朋友们的小玩意儿们</p>
        <div className="flex gap-4">
          <Button asChild variant="primary" size="default">
            <Link href="/bazi">算八字</Link>
          </Button>
          <Button asChild variant="secondary" size="default">
            <Link href="/eat">今天吃什么</Link>
          </Button>
          <Button asChild variant="primary" size="default">
            <Link href="/chat">聊天</Link>
          </Button>
        </div>
        <p className="mt-12 text-[var(--muted-foreground)] text-sm">&mdash;&mdash; 喵十七</p>
      </div>
      {COMMIT && (
        <p className="fixed bottom-2 right-3 text-[var(--muted-foreground)] text-xs opacity-40 select-none font-mono">
          {COMMIT}
        </p>
      )}
    </PageLayout>
  );
}
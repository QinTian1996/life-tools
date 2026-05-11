import Link from 'next/link';
import { Button } from "@/components/ui/Button";
import PageLayout from '@/components/layout/PageLayout';

const COMMIT = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7);

const palette = [
  ["bg", "--background"], ["fg", "--foreground"],
  ["primary", "--primary"], ["primary-fg", "--primary-foreground"],
  ["secondary", "--secondary"], ["secondary-fg", "--secondary-foreground"],
  ["muted", "--muted"], ["muted-fg", "--muted-foreground"],
  ["accent", "--accent"], ["accent-fg", "--accent-foreground"],
  ["card", "--card"], ["card-fg", "--card-foreground"],
  ["border", "--border"], ["ring", "--ring"],
  ["destructive", "--destructive"], ["success", "--success"],
] as const;

export default function Home() {
  return (
    <PageLayout>
      <div className="flex-1 flex">
        <aside className="w-40 shrink-0 border-r border-[var(--border)] p-3 flex flex-col gap-1.5 overflow-y-auto">
          <p className="text-xs text-[var(--muted-foreground)] mb-1 font-mono">palette</p>
          {palette.map(([label, token]) => (
            <div key={token} className="flex items-center gap-2 text-xs">
              <span
                className="w-5 h-5 rounded border border-[var(--border)] shrink-0"
                style={{ background: `var(${token})` }}
              />
              <span className="text-[var(--muted-foreground)] truncate font-mono">{label}</span>
            </div>
          ))}
        </aside>
        <div className="flex-1 flex flex-col items-center justify-center">
          <img src="/logo.svg" alt="喵十七" className="w-24 h-auto mb-4 opacity-90" />
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
      </div>
      {COMMIT && (
        <p className="fixed bottom-2 right-3 text-[var(--muted-foreground)] text-xs opacity-40 select-none font-mono">
          {COMMIT}
        </p>
      )}
    </PageLayout>
  );
}
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SiteHeaderProps {
  title?: string;
}

export default function SiteHeader({ title }: SiteHeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  const logoContent = (
    <>
      <span className="text-lg font-semibold">喵十七</span>
    </>
  );

  return (
    <>
      <header data-site-header className="fixed top-0 left-0 right-0 z-10 bg-[var(--header-bg)] text-[var(--header-fg)]">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            {isHome ? (
              <span className="flex items-center gap-2">{logoContent}</span>
            ) : (
              <Link href="/" className="flex items-center gap-2">
                {logoContent}
              </Link>
            )}
          </div>
          {title && <span className="text-sm">{title}</span>}
        </div>
      </header>
      <div className="h-14" />
    </>
  );
}

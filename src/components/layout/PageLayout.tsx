import SiteHeader from './SiteHeader';

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <SiteHeader title={title} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
import SiteHeader from './SiteHeader';

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export default function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-orange-50">
      <SiteHeader title={title} />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
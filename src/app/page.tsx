export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-amber-50 to-orange-50">
      <h1 className="text-4xl font-bold text-amber-900 mb-4">喵十七的工具箱 🔧</h1>
      <p className="text-amber-700 text-lg mb-8">给朋友们的小玩意儿们</p>
      <div className="flex gap-4">
        <a
          href="/bazi"
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          算八字
        </a>
        <a
          href="/eat"
          className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          今天吃什么
        </a>
      </div>
      <p className="mt-12 text-amber-400 text-sm">—— 喵十七</p>
    </main>
  );
}

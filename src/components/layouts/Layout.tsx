import { Sidebar } from "./Sidebar/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-[#0a0a0a] text-zinc-900 dark:text-white transition-colors">
      <Sidebar />
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}

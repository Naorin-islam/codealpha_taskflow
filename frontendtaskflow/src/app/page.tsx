import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50">
      <header className="px-8 py-6 flex justify-between items-center border-b bg-white dark:bg-slate-800">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">TaskFlow</h1>
        <div className="space-x-4">
          <Link href="/login">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Sign up</Button>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h2 className="text-5xl font-extrabold tracking-tight mb-6">
          Manage your projects with <span className="text-indigo-600 dark:text-indigo-400">TaskFlow</span>
        </h2>
        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10">
          A modern, professional, production-ready project management application designed for seamless team collaboration.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8">Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="lg" className="text-lg px-8">View Demo</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}

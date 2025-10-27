import Timeline from '@/components/ui/Timeline'; // Ajuste o caminho se necessário
import Link from 'next/link';

export default function ChangelogPage() {
  return (
    // Fundo mais escuro e gradiente mais sutil
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-16 bg-linear-to-br from-gray-900 via-black to-gray-900/80 text-gray-300">
      <div className="w-full max-w-3xl">
         <header className="text-center mb-12 md:mb-16">
            {/* Título com gradiente mais vibrante */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-400 to-indigo-400">
              MyLIT Changelog
            </h1>
            <p className="text-lg text-gray-400">Follow the project&apos;s evolution, step by step.</p>
             <Link href="/" className="mt-6 inline-block text-blue-400 hover:text-blue-300 transition duration-200 text-sm">
               ← Back to Home (Coming Soon)
             </Link>
        </header>

        <Timeline filterTags={{ main: null, secondary: null }} filterDate={new Date()} />

      </div>
       <footer className="mt-16 text-center text-gray-500 text-xs">
            MyLIT Project - {new Date().getFullYear()}
        </footer>
    </main>
  );
}


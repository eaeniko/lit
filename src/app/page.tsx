"use client"; // Add this directive at the top

import Link from 'next/link';
// Corrected import: Added Rocket
import { 
  Github, Twitter, BookText, Milestone, Users, Mic, HeartHandshake, Sparkles, Rocket,
  Wrench,

} from 'lucide-react';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-300">
      <div className="text-center max-w-2xl">
        {/* Logo/Title Placeholder */}
        <Sparkles className="w-16 h-16 mx-auto mb-6 text-cyan-400" /> {/* Placeholder Icon */}
        <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
          LIT
        </h1>
        <p className="text-xl text-gray-400 mb-10">
          Life. Improved. Together. <br /> The Gamified Productivity Superapp.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Link href="/changelog" className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md border border-white/10 rounded-lg transition duration-200 text-sm font-medium">
            <Milestone size={16} /> Changelog
          </Link>
          {/* Link with onClick requires "use client" */}
          <Link href="/#roadmap" className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md border border-white/10 rounded-lg transition duration-200 text-sm font-medium text-gray-500 cursor-not-allowed" onClick={(e) => e.preventDefault()}>
             <BookText size={16} /> Roadmap (Soon)
          </Link>
           {/* Link para a ferramenta local - abre em nova aba */}
          <a href="/changelog/add-event" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md border border-white/10 rounded-lg transition duration-200 text-sm font-medium" title="Add Timeline Event (Local Tool)">
            <Wrench size={16} /> Timeline Event (Tool)
          </a>
        </div>

        {/* Social & Community Links */}
        <div className="flex justify-center gap-6 text-gray-500">
          {/* Use process.env.NEXT_PUBLIC_GITHUB_REPO_URL or hardcode */}
          <a href="https://github.com/eaeniko/lit" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition duration-200" title="GitHub Repository">
            <Github size={24} />
          </a>
           {/* Use process.env.NEXT_PUBLIC_PATREON_URL or hardcode */}
          <a href="https://www.patreon.com/seu-patreon" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition duration-200" title="Support on Patreon">
            <HeartHandshake size={24} />
          </a>
           {/* Kickstarter - Link quando estiver pronto (requires "use client") */}
          <a href="/#kickstarter" onClick={(e) => e.preventDefault()} className="hover:text-green-400 transition duration-200 text-gray-600 cursor-not-allowed" title="Kickstarter (Coming Soon)">
             <Rocket size={24} /> {/* Placeholder Icon */}
          </a>
           {/* Discord - Link quando estiver pronto (requires "use client") */}
           <a href="/#discord" onClick={(e) => e.preventDefault()} className="hover:text-indigo-400 transition duration-200 text-gray-600 cursor-not-allowed" title="Join Discord (Coming Soon)">
             <Mic size={24} /> {/* Placeholder Icon */}
           </a>
           {/* Reddit - Link quando estiver pronto (requires "use client") */}
           <a href="/#reddit" onClick={(e) => e.preventDefault()} className="hover:text-red-400 transition duration-200 text-gray-600 cursor-not-allowed" title="Reddit Community (Coming Soon)">
             <Users size={24} /> {/* Placeholder Icon */}
           </a>
            {/* Twitter/X - Adicione seu link */}
           <a href="https://twitter.com/eaeniko" target="_blank" rel="noopener noreferrer" className="hover:text-sky-400 transition duration-200" title="Follow on X">
             <Twitter size={24} />
           </a>

        </div>

      </div>
       <footer className="absolute bottom-4 text-center text-gray-600 text-xs">
           LIT Project - {new Date().getFullYear()}
       </footer>
    </main>
  );
}


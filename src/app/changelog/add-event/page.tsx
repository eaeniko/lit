"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, X, Check, Copy, AlertTriangle, // CORREÇÃO: Removido 'Clipboard' (não usado)
  ArrowLeft, Palette, Code2, BookOpenText, Users2, 
  Megaphone, Settings2, Sparkles, RotateCw, Wrench, 
  Lightbulb, Rocket, MessageSquareText, PartyPopper, 
  Milestone, Construction, LucideProps 
} from 'lucide-react';
import { toast } from "sonner";

// Importar componentes shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; 

// --- Tipos e Constantes ---
type LucideIconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
const MAIN_TAGS_KEY = 'timelineMainTags_v4';
const SECONDARY_TAGS_KEY = 'timelineSecondaryTags_v4';
const defaultMainTags = ['DEV', 'DESIGN', 'DOCS', 'COMMUNITY', 'MARKETING', 'META'];
const defaultSecondaryTags = ['NEW', 'UPDATE', 'FIX', 'REFACTOR', 'RELEASE', 'POST', 'INIT', 'WIP'];

const defaultIcons: { [key: string]: string } = {
  DEV: 'Code2', DESIGN: 'Palette', DOCS: 'BookOpenText', COMMUNITY: 'Users2', MARKETING: 'Megaphone', META: 'Settings2',
  NEW: 'Sparkles', UPDATE: 'RotateCw', FIX: 'Wrench', REFACTOR: 'Lightbulb', RELEASE: 'Rocket', POST: 'MessageSquareText', INIT: 'PartyPopper', WIP: 'Construction',
  default: 'Milestone'
};

const iconMap: { [key: string]: LucideIconComponent } = {
  Code2, Palette, BookOpenText, Users2, Megaphone, Settings2, Sparkles,
  RotateCw, Wrench, Lightbulb, Rocket, MessageSquareText, PartyPopper, Milestone, Construction,
};

// --- Funções de Leitura do LocalStorage (executadas UMA VEZ) ---
const loadInitialTags = (key: string, defaults: string[]): string[] => {
  // 'window' só existe no cliente. No SSR (Server-Side Rendering), retorna o padrão.
  if (typeof window === 'undefined') {
    return defaults;
  }
  try {
    const stored = localStorage.getItem(key);
    const loaded = stored ? JSON.parse(stored) : defaults;
    return loaded.length > 0 ? loaded : defaults;
  } catch (e: unknown) { // CORREÇÃO: Tipado como 'unknown'
    console.error(`Error loading ${key} from localStorage, resetting:`, e);
    return defaults;
  }
};

// --- Componente da Página ---
export default function AddEventPage() {
  // --- Estados do Formulário ---
  const [mainTag, setMainTag] = useState(defaultMainTags[0]);
  const [secondaryTag, setSecondaryTag] = useState(defaultSecondaryTags[0]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('');

  // --- Estados da Ferramenta de Tags ---
  // CORREÇÃO: Usa "lazy initializer" (uma função) para carregar do localStorage SÓ NA PRIMEIRA VEZ.
  const [mainTagsList, setMainTagsList] = useState(() => loadInitialTags(MAIN_TAGS_KEY, defaultMainTags));
  const [secondaryTagsList, setSecondaryTagsList] = useState(() => loadInitialTags(SECONDARY_TAGS_KEY, defaultSecondaryTags));
  
  const [newMainTag, setNewMainTag] = useState('');
  const [newSecondaryTag, setNewSecondaryTag] = useState('');

  // --- Estados do Resultado ---
  const [jsonFilename, setJsonFilename] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [commitMessage, setCommitMessage] = useState('');
  const [showResults, setShowResults] = useState(false);

  // --- Helper de Ícone ---
  const GetTagIcon = ({ tagName }: { tagName: string }) => {
    const iconName = defaultIcons[tagName.toUpperCase()] || defaultIcons.default;
    const IconComponent = iconMap[iconName] || Milestone;
    return <IconComponent size={14} className="mr-2 shrink-0" />;
  };

  // CORREÇÃO: Removido o useEffect de LEITURA.

  // --- Efeito para SALVAR Tags no LocalStorage QUANDO ELAS MUDAM ---
  useEffect(() => {
    try {
      localStorage.setItem(MAIN_TAGS_KEY, JSON.stringify(mainTagsList));
      localStorage.setItem(SECONDARY_TAGS_KEY, JSON.stringify(secondaryTagsList));
    } catch (e: unknown) { // CORREÇÃO: Tipado como 'unknown'
      console.error("Error saving tags:", e);
    }
  }, [mainTagsList, secondaryTagsList]); // Roda sempre que mainTagsList ou secondaryTagsList mudarem

  
  // --- Funções de Gerenciamento de Tags (Removido saveTags) ---
  const handleAddTag = (type: 'main' | 'secondary') => {
    const input = (type === 'main') ? newMainTag : newSecondaryTag;
    const tagList = (type === 'main') ? mainTagsList : secondaryTagsList;
    const setList = (type === 'main') ? setMainTagsList : setSecondaryTagsList;
    const setInput = (type === 'main') ? setNewMainTag : setNewSecondaryTag;

    const newTag = input.trim().toUpperCase().replace(/[^A-Z0-9_\-]/g, '');

    if (newTag && newTag.length > 0 && newTag.length <= 15) {
      if (!tagList.includes(newTag)) {
        const newList = [...tagList, newTag].sort();
        setList(newList); // Isso vai disparar o useEffect de salvar
        setInput('');
      } else { 
        toast.warning(`Tag "${newTag}" already exists.`);
      }
    } else if (!newTag) {
      toast.error('Tag cannot be empty.');
    } else {
      toast.error('Tag is too long (max 15 chars) or has invalid characters.');
    }
  };

  const handleRemoveTag = (tagToRemove: string, type: 'main' | 'secondary') => {
    const tagList = (type === 'main') ? mainTagsList : secondaryTagsList;
    const setList = (type === 'main') ? setMainTagsList : setSecondaryTagsList;
    
    if (tagList.length <= 1) {
      toast.error(`Cannot remove the last ${type} tag.`); return;
    }
    if (confirm(`Are you sure you want to remove the tag "${tagToRemove}"?`)) {
      const newList = tagList.filter(tag => tag !== tagToRemove);
      setList(newList); // Isso vai disparar o useEffect de salvar
      toast.info(`Tag "${tagToRemove}" removed.`);
    }
  };

  // --- Função de Geração (Submit) ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description) {
        toast.error("Title and Description are required.", {
            description: "Please fill out all required fields before generating."
        });
        return;
    }

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    const filename = `timeline-${year}-${month}.json`;
    const entryId = `${mainTag}-${secondaryTag}-${year}${month}${day}-${hour}${minute}${second}`;
    const descFormatted = description.replace(/\r\n|\r|\n/g, '\\n');
    let iconFinal = icon.trim();
    
    if (!iconFinal || !/^[A-Z][A-Za-z0-9]*$/.test(iconFinal)) {
      iconFinal = defaultIcons[mainTag.toUpperCase()] || defaultIcons[secondaryTag.toUpperCase()] || defaultIcons.default;
    }

    const newEntry = {
      id: entryId,
      date: now.toISOString(),
      tags: [mainTag, secondaryTag].filter(Boolean),
      icon: iconFinal,
      title: title,
      description: descFormatted
    };

    const jsonString = JSON.stringify(newEntry, null, 2);
    const outputString = `,\n${jsonString}`;
    const commitMsg = `Add ${mainTag}/${secondaryTag} - ${title}`;

    setJsonFilename(filename);
    setJsonOutput(outputString);
    setCommitMessage(commitMsg);
    setShowResults(true);

    setTitle('');
    setDescription('');
    setIcon('');
    
    toast.success("JSON Generated!", {
        description: "You can now copy the data below and paste it into your JSON file."
    });
  };

  // --- Função para Copiar ---
  // CORREÇÃO: Refatorado para usar .then().catch() e tipar 'err' como 'unknown'
  const copyToClipboard = (text: string, fieldName: string) => {
    if (!text) {
        toast.error("Nothing to copy.");
        return;
    }
    navigator.clipboard.writeText(text)
      .then(() => {
        toast.success("Copied to Clipboard!", {
          description: `${fieldName} has been copied.`,
        });
      })
      .catch((err: unknown) => { // CORREÇÃO: 'err' é 'unknown'
        console.error("Clipboard copy failed:", err);
        toast.error("Failed to copy", {
          description: "Could not copy text to clipboard.",
        });
      });
  };

  // --- Renderização ---
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-16 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-gray-300">
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/changelog" className="inline-flex items-center text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
            <ArrowLeft size={16} className="mr-2" />
            Back to Changelog
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <Card className="glass-card border-gray-700/50 bg-gray-900/70">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                Add New Timeline Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form id="event-form" onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="tag-principal" className="text-gray-300 mb-1.5">Main Tag *</Label>
                  <Select value={mainTag} onValueChange={setMainTag} required>
                    <SelectTrigger id="tag-principal" className="w-full bg-gray-800/80 border-gray-600/50 focus:ring-emerald-500 text-gray-200">
                      <SelectValue placeholder="Select Main Tag" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                      {mainTagsList.map(tag => (
                        <SelectItem key={tag} value={tag} className="focus:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <GetTagIcon tagName={tag} />
                            {tag}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tag-secundaria" className="text-gray-300 mb-1.5">Secondary Tag *</Label>
                  <Select value={secondaryTag} onValueChange={setSecondaryTag} required>
                    <SelectTrigger id="tag-secundaria" className="w-full bg-gray-800/80 border-gray-600/50 focus:ring-emerald-500 text-gray-200">
                      <SelectValue placeholder="Select Secondary Tag" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700 text-gray-200">
                      {secondaryTagsList.map(tag => (
                        <SelectItem key={tag} value={tag} className="focus:bg-gray-700">
                          <div className="flex items-center gap-2">
                            <GetTagIcon tagName={tag} />
                            {tag}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="titulo" className="text-gray-300 mb-1.5">Short Title *</Label>
                  <Input 
                    type="text" id="titulo" value={title} onChange={(e) => setTitle(e.target.value)}
                    required maxLength={50} placeholder="E.g., Landing Page Deployed" 
                    className="bg-gray-800/80 border-gray-600/50 focus-visible:ring-emerald-500 text-gray-200 placeholder:text-gray-400" 
                  />
                </div>

                <div>
                  <Label htmlFor="descricao" className="text-gray-300 mb-1.5">Detailed Description * (Use \n for new lines)</Label>
                  <Textarea 
                    id="descricao" value={description} onChange={(e) => setDescription(e.target.value)}
                    rows={4} required placeholder="Details... Use \n for line breaks in JSON." 
                    className="bg-gray-800/80 border-gray-600/50 focus-visible:ring-emerald-500 text-gray-200 placeholder:text-gray-400" 
                  />
                </div>

                 <div>
                  <Label htmlFor="icone" className="text-gray-300 mb-1.5">Lucide Icon Name (Optional)</Label>
                  <Input 
                    type="text" id="icone" value={icon} onChange={(e) => setIcon(e.target.value)}
                    placeholder="E.g., Code2, Palette (Leave blank for default)" 
                    className="bg-gray-800/80 border-gray-600/50 focus-visible:ring-emerald-500 text-gray-200 placeholder:text-gray-400" 
                  />
                   <p className="text-xs text-gray-400 mt-2">
                     Find names at: <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">lucide.dev/icons</a>
                   </p>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white font-bold py-2.5 px-4 shadow-lg h-11">
                  Generate JSON Entry + Commit Msg
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="glass-card border-gray-700/50 bg-gray-900/70">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-emerald-400">
                Manage Tags
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-300 border-b border-gray-600 pb-1">Main Tags</h3>
                <ul className="mb-4 space-y-2 max-h-48 overflow-y-auto pr-2 tag-list">
                  {mainTagsList.map(tag => (
                    <li key={tag} className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-1.5 rounded-md border border-gray-600/50 shadow-sm">
                      <span className="font-medium text-gray-300 flex items-center">
                        <GetTagIcon tagName={tag} />
                        {tag}
                      </span>
                      <Button variant="ghost" size="icon" className="w-6 h-6 text-red-400 hover:text-red-500 hover:bg-red-900/30" onClick={() => handleRemoveTag(tag, 'main')}>
                        <X size={14} />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 items-center">
                  <Input 
                    type="text" value={newMainTag} onChange={(e) => setNewMainTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('main'))}
                    placeholder="New main tag (e.g., TEST)" 
                    className="grow bg-gray-800/80 border-gray-600/50 focus-visible:ring-emerald-500 text-sm h-9 text-gray-200 placeholder:text-gray-400" 
                  />
                  <Button className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-9" onClick={() => handleAddTag('main')}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-300 border-b border-gray-600 pb-1">Secondary Tags</h3>
                <ul className="mb-4 space-y-2 max-h-48 overflow-y-auto pr-2 tag-list">
                  {secondaryTagsList.map(tag => (
                    <li key={tag} className="flex justify-between items-center text-sm bg-gray-700/50 px-3 py-1.5 rounded-md border border-gray-600/50 shadow-sm">
                      <span className="font-medium text-gray-300 flex items-center">
                        <GetTagIcon tagName={tag} />
                        {tag}
                      </span>
                      <Button variant="ghost" size="icon" className="w-6 h-6 text-red-400 hover:text-red-500 hover:bg-red-900/30" onClick={() => handleRemoveTag(tag, 'secondary')}>
                        <X size={14} />
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 items-center">
                  <Input 
                    type="text" value={newSecondaryTag} onChange={(e) => setNewSecondaryTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag('secondary'))}
                    placeholder="New secondary tag (e.g., WIP)" 
                    className="grow bg-gray-800/80 border-gray-600/50 focus-visible:ring-emerald-500 text-sm h-9 text-gray-200 placeholder:text-gray-400" 
                  />
                  <Button className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-sm h-9" onClick={() => handleAddTag('secondary')}>
                    <Plus size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {showResults && (
          <Card className="glass-card mt-8 border-gray-700/50 bg-gray-900/70">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-emerald-400 flex items-center">
                <Check size={20} className="mr-2" />
                Success! Copy and paste below:
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="json-filename" className="text-gray-300 mb-1.5">1. JSON Filename (in `public/data/` folder):</Label>
                <div className="flex gap-2">
                  <Input id="json-filename" readOnly value={jsonFilename} className="flex-1 bg-gray-700/70 text-gray-300 border-gray-600/50" />
                  <Button variant="outline" size="icon" className="bg-gray-700/70 border-gray-600/50 hover:bg-gray-600/70" onClick={() => copyToClipboard(jsonFilename, 'Filename')}>
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="json-output" className="text-gray-300 mb-1.5">2. JSON Block to add (Paste inside `[]`, add comma if needed):</Label>
                <div className="flex gap-2">
                  <Textarea id="json-output" readOnly value={jsonOutput} rows={12} className="flex-1 bg-gray-700/70 text-gray-300 border-gray-600/50 font-mono text-sm" />
                  <Button variant="outline" size="icon" className="bg-gray-700/70 border-gray-600/50 hover:bg-gray-600/70" onClick={() => copyToClipboard(jsonOutput, 'JSON Block')}>
                    <Copy size={16} />
                  </Button>
                </div>
                <div className="text-yellow-400 text-xs mt-2 p-3 bg-yellow-900/20 border border-yellow-700/30 rounded-md flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <p><strong>Important:</strong> If the file `timeline-YYYY-MM.json` already has entries, add a comma `,` *before* pasting this block (paste it just before the final `]`). If this is the *first entry* for the month, create the file and paste this block *between* `[` and `]`.</p>
                </div>
              </div>
              <div>
                <Label htmlFor="commit-message" className="text-gray-300 mb-1.5">3. Suggested Commit Message:</Label>
                <div className="flex gap-2">
                  <Input id="commit-message" readOnly value={commitMessage} className="flex-1 bg-gray-700/70 text-gray-300 border-gray-600/50" />
                  <Button variant="outline" size="icon" className="bg-gray-700/70 border-gray-600/50 hover:bg-gray-600/70" onClick={() => copyToClipboard(commitMessage, 'Commit Message')}>
                    <Copy size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-400">👉 Remember to `git add .`, `git commit -m &quot;YOUR MESSAGE&quot;`, and `git push` after pasting.</p>
            </CardFooter>
          </Card>
        )}
      </div>

      <footer className="text-center text-xs text-gray-500 mt-12 pb-4">
        LIT Timeline Tool - Internal Use | &copy; {new Date().getFullYear()}
      </footer>
    </main>
  );
}


/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    Code2, Palette, BookOpenText, Users2, Megaphone, Settings2, Sparkles,
    RotateCw, Wrench, Lightbulb, Rocket, MessageSquareText, PartyPopper, Milestone, Construction,
    LucideProps,
    Loader2, ServerCrash, Filter, X
} from 'lucide-react';

// Define the type for Lucide components explicitly
type LucideIconComponent = React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;

interface TimelineEntry {
    id: string;
    date: string;
    tags: string[];
    icon: string;
    title: string;
    description: string;
}

interface TimelineProps {
    initialEntries?: TimelineEntry[];
    filterTags: { main: string | null; secondary: string | null };
    filterDate: Date | null;
}


// --- Constants and Helper Functions ---
const tagColors: { [key: string]: string } = {
    DEV: 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 ring-1 ring-emerald-500/20',
    DESIGN: 'bg-fuchsia-900/50 text-fuchsia-300 border border-fuchsia-500/30 ring-1 ring-fuchsia-500/20',
    DOCS: 'bg-amber-900/50 text-amber-300 border border-amber-500/30 ring-1 ring-amber-500/20',
    COMMUNITY: 'bg-rose-900/50 text-rose-300 border border-rose-500/30 ring-1 ring-rose-500/20',
    MARKETING: 'bg-sky-900/50 text-sky-300 border border-sky-500/30 ring-1 ring-sky-500/20',
    META: 'bg-slate-800/50 text-slate-300 border border-slate-500/30 ring-1 ring-slate-500/20',
    INIT: 'bg-blue-900/50 text-blue-300 border border-blue-500/30 ring-1 ring-blue-500/20',
    NEW: 'bg-teal-900/50 text-teal-300 border border-teal-500/30 ring-1 ring-teal-500/20',
    UPDATE: 'bg-orange-900/50 text-orange-300 border border-orange-500/30 ring-1 ring-orange-500/20',
    FIX: 'bg-red-900/50 text-red-300 border border-red-500/30 ring-1 ring-red-500/20',
    RELEASE: 'bg-cyan-900/50 text-cyan-300 border border-cyan-500/30 ring-1 ring-cyan-500/20',
    POST: 'bg-violet-900/50 text-violet-300 border border-violet-500/30 ring-1 ring-violet-500/20',
    REFACTOR: 'bg-indigo-900/50 text-indigo-300 border border-indigo-500/30 ring-1 ring-indigo-500/20',
    default: 'bg-gray-800/50 text-gray-300 border border-gray-600/30 ring-1 ring-gray-600/20'
};
const getTagStyle = (tag: string): string => tagColors[tag.toUpperCase()] || tagColors.default;

const iconMapping: { [key: string]: LucideIconComponent } = {
    Code2, Palette, BookOpenText, Users2, Megaphone, Settings2, Sparkles,
    RotateCw, Wrench, Lightbulb, Rocket, MessageSquareText, PartyPopper, Milestone, Construction,
    default: Milestone
};

const getIconComponent = (iconName: string): LucideIconComponent => {
    const IconMapped = Object.keys(iconMapping).find(key => key.toLowerCase() === iconName.toLowerCase());
    const IconComponent = IconMapped ? iconMapping[IconMapped] : null;

    if (IconComponent) {
        return IconComponent;
    } else {
        // console.warn(`Lucide icon component not found for "${iconName}", using default.`);
        return iconMapping.default;
    }
};

const formatDate = (isoString: string): string => {
    try {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false
        });
    } catch (e) {
        console.error("Error formatting date:", isoString, e);
        return isoString;
    }
};

// --- Timeline Component ---
const Timeline: React.FC<TimelineProps> = ({ filterTags, filterDate }) => {
    const [allEntries, setAllEntries] = useState<TimelineEntry[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
    const [visibleEntries, setVisibleEntries] = useState<TimelineEntry[]>([]); // Keep track of visible items

    // --- Data Fetching Logic ---
    const loadMonthData = useCallback(async (year: number, month: number): Promise<TimelineEntry[]> => {
        const monthStr = String(month).padStart(2, '0');
        const filename = `/data/timeline-${year}-${monthStr}.json`;
        // console.log(`Attempting to fetch: ${filename}`);

        try {
            const response = await fetch(`${filename}?t=${Date.now()}`);

            if (!response.ok) {
                if (response.status === 404) {
                    console.log(`File not found: ${filename}`);
                    return [];
                } else {
                    throw new Error(`HTTP error! status: ${response.status} for ${filename}`);
                }
            }
            const data = await response.json();
             if (!Array.isArray(data)) {
                 console.error(`Invalid JSON format in ${filename}`);
                 throw new Error(`Invalid data format in ${filename}`);
             }
             // console.log(`Fetched ${data.length} entries from ${filename}`);
             return data.map((item: any) => ({
                 id: item.id ?? `entry-${Date.now()}-${Math.random()}`,
                 date: item.date ?? new Date().toISOString(),
                 tags: Array.isArray(item.tags) ? item.tags : [],
                 icon: typeof item.icon === 'string' ? item.icon : 'default',
                 title: typeof item.title === 'string' ? item.title : 'No Title',
                 description: typeof item.description === 'string' ? item.description : '',
             }));
        } catch (err) {
            console.error(`Error fetching/parsing ${filename}:`, err);
            throw err;
        }
    }, []);

    // Load initial data
    const loadInitialData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setAllEntries([]);
        setVisibleEntries([]);
        setHasMore(true);

        const initialYear = new Date().getFullYear();
        const initialMonth = new Date().getMonth() + 1;
        let dataLoaded = false;
        let loadedYear = initialYear;
        let loadedMonth = initialMonth;

        try {
            console.log("Initial load...");
            let initialData = await loadMonthData(initialYear, initialMonth);

            if (!initialData || initialData.length === 0) {
                console.warn("Current month empty/not found, fallback: 2025-10");
                initialData = await loadMonthData(2025, 10);
                if (initialData && initialData.length > 0) {
                    loadedYear = 2025;
                    loadedMonth = 10;
                    dataLoaded = true;
                }
            } else {
                 dataLoaded = true;
            }

            if (dataLoaded) {
                 const sortedData = initialData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                setAllEntries(sortedData);
                setCurrentYear(loadedYear);
                setCurrentMonth(loadedMonth);
                setHasMore(true);
                console.log("Initial data loaded.");
            } else {
                 console.error("Failed to load any initial data.");
                 setError("Could not load initial data. Ensure 'timeline-YYYY-MM.json' exists.");
                 setHasMore(false);
            }

        } catch (err) {
             console.error("Initial load error:", err);
             setError(`Failed to load data. ${err instanceof Error ? err.message : 'Unknown error'}`);
             setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [loadMonthData]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    // --- Filtering Logic ---
    const filteredEntries = useMemo(() => {
        return allEntries.filter(entry => {
            const mainTagMatch = !filterTags.main || (entry.tags && entry.tags.includes(filterTags.main));
            const secondaryTagMatch = !filterTags.secondary || (entry.tags && entry.tags.includes(filterTags.secondary));
            let dateMatch = true;
            if (filterDate) {
                try {
                    const entryDate = new Date(entry.date);
                    dateMatch = entryDate.getFullYear() === filterDate.getFullYear() && entryDate.getMonth() === filterDate.getMonth();
                } catch { dateMatch = false; }
            }
            return mainTagMatch && secondaryTagMatch && dateMatch;
        });
    }, [allEntries, filterTags, filterDate]);

    // Update visible entries when filtered entries change
    useEffect(() => {
        setVisibleEntries(filteredEntries);
    }, [filteredEntries]); // Corrected dependency


    // --- Load More Logic ---
    const loadMore = useCallback(async () => {
        if (isLoadingMore || !hasMore) return;
        setIsLoadingMore(true);
        setError(null);

        let prevMonth = currentMonth - 1;
        let prevYear = currentYear;
        if (prevMonth === 0) { prevMonth = 12; prevYear--; }

        if (prevYear < 2025) { setHasMore(false); setIsLoadingMore(false); return; }

        try {
            const newData = await loadMonthData(prevYear, prevMonth);
            if (newData && newData.length > 0) {
                 setAllEntries(prevEntries => [...prevEntries, ...newData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
                 setCurrentYear(prevYear);
                 setCurrentMonth(prevMonth);
                 setHasMore(true);
            } else {
                setHasMore(false);
            }
        } catch (err) {
             console.error("Error loading older data:", err);
             setError(`Failed to load older entries. ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
            setIsLoadingMore(false);
        }
    }, [isLoadingMore, hasMore, currentMonth, currentYear, loadMonthData]);

    const showLoadMoreButton = hasMore && !filterDate;

    return (
        <div className="relative">
            {/* Main timeline line */}
            {visibleEntries.length > 0 && (
                <div className="absolute top-0 bottom-0 left-5 w-px bg-gray-700/60 z-0" style={{ top: '1.5rem', left: '1.25rem' }}></div>
            )}

            {/* Initial Loading State */}
            {isLoading && visibleEntries.length === 0 && (
                <div className="text-center py-12 text-gray-500 flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin h-6 w-6" /> Loading Timeline...
                </div>
            )}

            {/* Error State */}
            {error && (
                 <div className="text-center py-12 text-red-400 flex flex-col items-center justify-center gap-3 glass-card bg-red-900/20 border-red-500/30 p-6 max-w-md mx-auto">
                    <ServerCrash className="h-10 w-10 text-red-500" />
                    <p className="font-semibold">Oops! Failed to load timeline.</p>
                    <p className="text-sm text-red-300">{error}</p>
                    <button onClick={loadInitialData} className="mt-4 bg-red-600/50 hover:bg-red-500/70 text-white text-xs font-semibold py-1 px-3 rounded border border-red-400/30 transition duration-150"> Retry Load </button>
                 </div>
            )}

            {/* No Results State */}
            {!isLoading && !error && visibleEntries.length === 0 && (
                <div className="text-center py-12 text-gray-500 flex flex-col items-center justify-center gap-3 glass-card bg-gray-800/20 border-gray-600/30 p-6 max-w-md mx-auto">
                    <Filter className="h-10 w-10 text-gray-600" />
                    <p className="font-semibold">No timeline entries found.</p>
                    <p className="text-sm text-gray-400">Try adjusting the filters or adding new events.</p>
                </div>
            )}

            {/* Timeline Entries (using visibleEntries) */}
            {!isLoading && !error && visibleEntries.map((entry, index) => {
                 const IconComponent = getIconComponent(entry.icon || 'default');
                 return (
                     <div key={entry.id || index} className="relative pl-14 pb-10 group">
                         {/* Icon Container */}
                         <div className={`
                             absolute top-4 left-5 transform -translate-x-1/2 w-10 h-10 rounded-full
                             flex items-center justify-center bg-gray-800/60 backdrop-blur-md
                             border border-white/10 ring-4 ring-gray-900/70 z-10 text-blue-400 shadow-md
                         `}>
                             <IconComponent size={18} strokeWidth={2} />
                         </div>

                         {/* Content Card */}
                         <div className={`
                             ml-3 bg-gradient-to-br from-gray-900/50 via-black/30 to-gray-900/40 backdrop-blur-lg
                             border border-white/10 rounded-xl shadow-lg p-5 transition-all duration-300
                             group-hover:border-white/20 group-hover:shadow-xl group-hover:from-gray-800/60
                         `}>
                              {/* Date and Tags */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                                  <span className="text-xs font-medium text-gray-500 mb-1.5 sm:mb-0 order-last sm:order-first">{formatDate(entry.date)}</span>
                                  <div className="shrink-0 flex flex-wrap gap-1.5 order-first sm:order-last"> {/* Updated class */}
                                      {entry.tags.map((tag, tagIndex) => (
                                          <span key={tagIndex} className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${getTagStyle(tag)}`}>
                                              {tag}
                                          </span>
                                      ))}
                                  </div>
                             </div>
                             {/* Title */}
                              <h3 className="text-lg font-semibold text-gray-100 mb-1.5">{entry.title}</h3>
                             {/* Description */}
                              <p className="text-sm text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: entry.description.replace(/\\n/g, '<br />').replace(/\[Link Here\]/g, '<a href="#" class="text-blue-400 hover:underline">Link</a>') }}></p>
                         </div>
                     </div>
                 );
            })}

            {/* End Feedback or Load More Button */}
            {!isLoading && !error && !hasMore && visibleEntries.length > 0 && (
                 <div className="text-center text-gray-600 py-10 text-sm">~ End of Timeline ~</div>
            )}
            {/* Show Load More only if hasMore is true AND not filtering by date */}
            {!isLoading && showLoadMoreButton && (
                <div className="text-center mt-6 mb-10">
                    <button
                        onClick={loadMore}
                        className={`
                            inline-flex items-center justify-center gap-2
                            bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-md border border-white/10
                            text-gray-300 font-semibold py-2 px-6 rounded-lg transition duration-200 shadow-sm
                            disabled:opacity-50 disabled:cursor-wait disabled:transform-none disabled:filter-none
                        `}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? (
                            <> <Loader2 className="animate-spin h-4 w-4 mr-1" /> Loading Older... </>
                        ) : (
                             'Load Older Entries'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default Timeline;


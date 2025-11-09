'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { WebRing } from './components/WebRing';
import { Sidebar } from './components/Sidebar';

interface Site {
    name: string;
    website: string;
    year: number;
    program: string;
}

interface WebringData {
    sites: Site[];
}

type SortField = 'name' | 'program' | 'year';
type SortDirection = 'asc' | 'desc';

const DEFAULT_SIDEBAR_WIDTH = 800;
const MIN_SIDEBAR_WIDTH = 250;
const MAX_SIDEBAR_WIDTH = 800;
const TABS = ['GCS', 'COMP', 'COEN', 'SOEN', 'MECH', 'ELEC'];

export default function Home() {
    const [webringData, setWebringData] = useState<WebringData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hoveredSite, setHoveredSite] = useState<string | null>(null);
    const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);
    const [sidebarWidth, setSidebarWidth] = useState(DEFAULT_SIDEBAR_WIDTH);
    const [isResizing, setIsResizing] = useState(false);
    const [sortField, setSortField] = useState<SortField>('year');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [selectedTab, setSelectedTab] = useState<string>('GCS');

    const sidebarRef = useRef<HTMLDivElement>(null);

    const filteredWebringData = useMemo(() => {
        if (!webringData) return null;
        if (selectedTab === 'GCS') {
            return webringData;
        }
        return {
            sites: webringData.sites.filter(site => site.program === selectedTab)
        };
    }, [webringData, selectedTab]);

    useEffect(() => {
        async function loadWebringData() {
            try {
                const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
                const response = await fetch(`${basePath}/webring.json`);
                if (!response.ok) {
                    throw new Error('Failed to fetch webring data');
                }
                const data = await response.json();
                setWebringData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                console.error('Error fetching webring data:', err);
            }
        }

        loadWebringData();

        const savedWidth = localStorage.getItem('sidebarWidth');
        if (savedWidth) {
            setSidebarWidth(Math.max(MIN_SIDEBAR_WIDTH, Math.min(MAX_SIDEBAR_WIDTH, parseInt(savedWidth))));
        }


    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isResizing) return;

            const container = sidebarRef.current?.parentElement;
            if (!container) return;

            const rect = container.getBoundingClientRect();
            const newWidth = e.clientX - rect.left;

            if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= MAX_SIDEBAR_WIDTH) {
                setSidebarWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            if (sidebarWidth !== DEFAULT_SIDEBAR_WIDTH) {
                localStorage.setItem('sidebarWidth', sidebarWidth.toString());
            }
        };

        if (isResizing) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isResizing, sidebarWidth]);

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
                    <p className="text-foreground">{error}</p>
                </div>
            </div>
        );
    }

    if (!webringData) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center">
                    <p className="text-foreground">Loading ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background text-foreground">
            <style>{`
                   @keyframes fadeIn {
                       from {
                           opacity: 0;
                           transform: translateY(10px);
                       }
                       to {
                           opacity: 1;
                           transform: translateY(0);
                       }
                   }
                   
                   a.webring-link {
                       transition: color 0.3s ease;
                       position: relative;
                       display: inline-block;
                       color: var(--link);
                   }
                   
                   a.webring-link::after {
                       content: '';
                       position: absolute;
                       bottom: -2px;
                       left: 0;
                       height: 0.125rem;
                       width: 0;
                       background-color: var(--accent1);
                       transition: width 0.3s ease;
                   }
                   
                   a.webring-link:hover {
                       color: var(--accent1);
                   }
                   
                   a.webring-link:hover::after {
                       width: 100%;
                   }
               `}</style>
            <header className="py-4 flex-shrink-0" style={{ animation: 'fadeIn 0.6s ease-in-out 0s both' }}>
                <div className="max-w-8xl mx-auto px-8" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '1rem' }}>
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Iosevka, monospace' }}>
                                Concordia Webring
                            </h1>
                            <p className="text-comment text-sm mt-1">
                                A collection of personal websites from students and alumni of Concordia University's Gina Cody School of Engineering and Computer Science.
                            </p>
                            <p className="text-comment text-sm mt-3">
                                Other webrings:
                            </p>
                            <ul className="text-comment text-sm mt-1 ml-4 space-y-1">
                                <li><a href="https://mcgillcswebring.pages.dev/" className="webring-link">McGill CS Webring</a></li>
                                <li><a href="https://webring.michaeldemar.co/" className="webring-link">UBC Webring</a></li>
                                <li><a href="https://se-webring.xyz/" className="webring-link">Waterloo Software Engineering Webring</a></li>
                                <li><a href="https://cs.uwatering.com/" className="webring-link">Waterloo Computer Science Webring</a></li>
                            </ul>
                            <p className="text-comment text-sm mt-3">
                                Want to add your website? Submit your information by creating a <a href="https://github.com/rvdeguzman/concordia-webring/" className="webring-link">pull request</a> that updates the <span style={{ fontFamily: 'Iosevka, monospace', color: 'var(--accent1)' }}>webring.json</span> file with your site details.
                            </p>
                            <div className="flex gap-4 mt-4">
                                {TABS.map((tab, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedTab(tab)}
                                        className="relative inline-block transition-colors duration-200"
                                        style={{
                                            color: selectedTab === tab ? 'var(--accent1)' : 'var(--comment)',
                                            fontWeight: selectedTab === tab ? '500' : '400',
                                            cursor: 'pointer',
                                            fontSize: '0.875rem',
                                            background: 'transparent',
                                            border: 'none',
                                            padding: '0.25rem 0',
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedTab !== tab) {
                                                (e.target as HTMLElement).style.color = 'var(--foreground)';
                                            }
                                            setHoveredProgram(tab);
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedTab !== tab) {
                                                (e.target as HTMLElement).style.color = 'var(--comment)';
                                            }
                                            setHoveredProgram(null);
                                        }}
                                    >
                                        {tab}
                                        <span
                                            className="absolute bottom-0 left-0 h-0.5 bg-[var(--accent1)] transition-all duration-300"
                                            style={{
                                                width: selectedTab === tab ? '100%' : '0%'
                                            }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden max-w-8xl mx-auto w-full">
                <div ref={sidebarRef} style={{ width: sidebarWidth, animation: 'fadeIn 0.6s ease-in-out 0.1s both', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    <Sidebar
                        sites={filteredWebringData?.sites || []}
                        hoveredSite={hoveredSite}
                        onSiteHover={setHoveredSite}
                        hoveredProgram={hoveredProgram}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={(field, direction) => {
                            setSortField(field);
                            setSortDirection(direction);
                        }}
                    />
                </div>

                <div
                    onMouseDown={() => setIsResizing(true)}
                    style={{
                        width: '4px',
                        backgroundColor: 'var(--line)',
                        cursor: 'col-resize',
                        transition: isResizing ? 'none' : 'background-color 0.2s',
                        opacity: isResizing ? 1 : 0.5,
                    }}
                    className="hover:opacity-100 hover:bg-accent1"
                />

                <div className="flex-1 flex flex-col" style={{ animation: 'fadeIn 0.6s ease-in-out 0.2s both' }}>
                    <div className="flex-1 overflow-hidden">
                        <WebRing
                            webringData={filteredWebringData || { sites: [] }}
                            hoveredSite={hoveredSite}
                            hoveredProgram={hoveredProgram}
                            sortField={sortField}
                            sortDirection={sortDirection}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

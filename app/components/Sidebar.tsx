'use client';

import { useState } from 'react';

interface Site {
    name: string;
    website: string;
    year: number;
    program: string;
}

type SortField = 'name' | 'program' | 'year';
type SortDirection = 'asc' | 'desc';

interface SidebarProps {
    sites: Site[];
    hoveredSite: string | null;
    onSiteHover: (siteName: string | null) => void;
    hoveredProgram: string | null;
    sortField: SortField;
    sortDirection: SortDirection;
    onSort: (field: SortField, direction: SortDirection) => void;
}

export function Sidebar({ sites, hoveredSite, onSiteHover, hoveredProgram, sortField, sortDirection, onSort }: SidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            onSort(field, sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            onSort(field, 'asc');
        }
    };

    const filteredAndSortedSites = [...sites]
        .filter((site) => {
            if (!searchQuery.trim()) return true;
            const query = searchQuery.toLowerCase();
            return (
                site.name.toLowerCase().includes(query) ||
                site.website.toLowerCase().includes(query) ||
                site.program.toLowerCase().includes(query) ||
                site.year.toString().includes(query)
            );
        })
        .sort((a, b) => {
            let aValue: string | number = '';
            let bValue: string | number = '';

            switch (sortField) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                 case 'program':
                    aValue = a.program.toLowerCase();
                    bValue = b.program.toLowerCase();
                    break;
                case 'year':
                    aValue = a.year;
                    bValue = b.year;
                    break;
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return sortDirection === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
            }
        });

    return (
        <div className="flex-1 overflow-hidden flex flex-col">
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
             <div className="px-6 py-3" style={{ borderBottom: '1px solid var(--line)', animation: 'fadeIn 0.6s ease-in-out 0s both' }}>
                 <div className="flex items-center gap-4">
                     <h2 className="text-lg font-semibold" style={{ fontFamily: 'Iosevka, monospace' }}>
                         Students ({sites.length})
                     </h2>
                     <input
                         type="text"
                         placeholder="Search by name, website, program, or year..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         onFocus={(e) => e.target.style.borderColor = 'var(--accent1)'}
                         onBlur={(e) => e.target.style.borderColor = 'var(--line)'}
                         className="flex-1 px-3 py-1.5 text-sm rounded border transition-colors focus:outline-none"
                         style={{
                             fontFamily: 'Iosevka, monospace',
                             backgroundColor: 'var(--background)',
                             borderColor: 'var(--line)',
                             color: 'var(--foreground)',
                         }}
                     />
                 </div>
             </div>

            <div className="flex-1 overflow-y-auto px-6 py-3">
                <table className="w-full border-collapse">
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--line)', animation: 'fadeIn 0.6s ease-in-out 0.05s both' }}>
                            <th
                                onClick={() => handleSort('name')}
                                className="text-left py-2 px-2 font-semibold text-comment cursor-pointer hover:text-foreground transition-colors"
                                style={{ fontFamily: 'Iosevka, monospace' }}
                            >
                                Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                             <th
                                 onClick={() => handleSort('program')}
                                 className="text-left py-2 px-2 font-semibold text-comment cursor-pointer hover:text-foreground transition-colors"
                                 style={{ fontFamily: 'Iosevka, monospace' }}
                             >
                                 Program {sortField === 'program' && (sortDirection === 'asc' ? '▲' : '▼')}
                             </th>
                             <th
                                onClick={() => handleSort('year')}
                                className="text-left py-2 px-2 font-semibold text-comment cursor-pointer hover:text-foreground transition-colors"
                                style={{ fontFamily: 'Iosevka, monospace' }}
                            >
                                Year {sortField === 'year' && (sortDirection === 'asc' ? '▲' : '▼')}
                            </th>
                            <th className="text-left py-2 px-2 font-semibold text-comment" style={{ fontFamily: 'Iosevka, monospace' }}>
                                Website
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedSites.map((site, index) => (
                            <tr
                                key={site.name}
                                className={`hover:bg-hover transition-colors cursor-pointer ${hoveredProgram === site.program || hoveredSite === site.name ? 'bg-hover' : ''
                                    }`}
                                style={{ borderBottom: '1px solid var(--line)', animation: `fadeIn 0.6s ease-in-out ${0.1 + index * 0.05}s both` }}
                                onMouseEnter={() => onSiteHover(site.name)}
                                onMouseLeave={() => onSiteHover(null)}
                            >
                                <td className="py-3 px-2 text-foreground" style={{ fontFamily: 'Iosevka, monospace' }}>
                                    {site.name}
                                </td>
                                 <td className="py-3 px-2 text-foreground" style={{ fontFamily: 'Iosevka, monospace' }}>
                                     {site.program}
                                 </td>
                                 <td className="py-3 px-2 text-foreground" style={{ fontFamily: 'Iosevka, monospace' }}>
                                    {site.year}
                                </td>
                                <td className="py-3 px-2">
                                    <a
                                        href={site.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="webring-link"
                                        style={{ fontFamily: 'Iosevka, monospace' }}
                                    >
                                        {site.website}
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

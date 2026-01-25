"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, Building2 } from "lucide-react";
import { Input } from "@/components/ui/input";

// Simple debounce hook if not available
function useDebounceValue<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

interface Developer {
    id: string;
    name: string;
    logo: string;
}

interface DeveloperAutocompleteProps {
    onSelect: (developer: Developer) => void;
    selectedDeveloper?: Developer | null;
}

export function DeveloperAutocomplete({ onSelect, selectedDeveloper }: DeveloperAutocompleteProps) {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState<Developer[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useDebounceValue(search, 300);

    useEffect(() => {
        const fetchDevelopers = async () => {
            if (!debouncedSearch.trim()) {
                setResults([]);
                return;
            }

            setIsLoading(true);
            try {
                const response = await fetch(`/api/developers/search?q=${encodeURIComponent(debouncedSearch)}`);
                if (response.ok) {
                    const data = await response.json();
                    setResults(data.developers || []);
                    setIsOpen(true);
                }
            } catch (error) {
                console.error("Search failed", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDevelopers();
    }, [debouncedSearch]);

    // Click outside to close
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (dev: Developer) => {
        onSelect(dev);
        setSearch("");
        setResults([]);
        setIsOpen(false);
    };

    if (selectedDeveloper) {
        return (
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center p-1 border border-gray-100">
                        <img src={selectedDeveloper.logo} alt={selectedDeveloper.name} className="max-w-full max-h-full object-contain" onError={(e) => (e.currentTarget.src = "")} />
                    </div>
                    <span className="font-medium text-gray-900">{selectedDeveloper.name}</span>
                </div>
                <button
                    type="button"
                    onClick={() => onSelect(null as any)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                    Change
                </button>
            </div>
        );
    }

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                <Input
                    placeholder="Search for a developer (e.g. Ayala...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>

            {isOpen && (results.length > 0 || isLoading) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isLoading ? (
                        <div className="p-4 text-center text-sm text-gray-500">
                            <Loader2 className="h-4 w-4 animate-spin mx-auto mb-1" />
                            Searching...
                        </div>
                    ) : results.length > 0 ? (
                        <ul className="py-1">
                            {results.map((dev) => (
                                <li
                                    key={dev.id}
                                    onClick={() => handleSelect(dev)} // Corrected call
                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                                >
                                    <div className="h-8 w-8 bg-gray-100 rounded flex items-center justify-center shrink-0">
                                        <img src={dev.logo} alt="" className="h-6 w-6 object-contain" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">{dev.name}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-4 text-center text-sm text-gray-500">
                            No developers found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

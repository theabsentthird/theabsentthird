import React from 'react';
import { Menu, Search, SlidersHorizontal } from 'lucide-react'; // Changed from Filter to ListFilter

interface HeaderProps {
    onMenuClick?: () => void;
    onSearch?: (query: string) => void;
    onFilterClick?: () => void;
    searchPlaceholder?: string;
    className?: string;
}

const Header: React.FC<HeaderProps> = ({
    onMenuClick,
    onSearch,
    onFilterClick,
    searchPlaceholder = 'Search...',
    className = '',
}) => {
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onSearch) {
            onSearch(e.target.value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch(e.currentTarget.value);
        }
    };

    return (
        <header
            className={`sticky top-0 z-50 bg-primary text-white shadow-md px-4 py-3 flex items-center justify-between ${className}`}
        >
            {/* Logo */}
            <a
                href="/"
                className="inline-flex items-center hover:text-secondary-1 transition-colors"
                aria-label="Home"
            >
                <img
                    src="/absent-text.svg"
                    alt="ABSENT"
                    className="h-6 w-auto" // Adjust height as needed
                />
            </a>

            {/* Search bar */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[55%] min-w-[200px] max-w-[700px] flex items-center bg-white rounded-full px-3 py-1 focus-within:ring-2 focus-within:ring-secondary-1">
                <Search
                    size={18}
                    className="text-gray-500 mr-2 flex-shrink-0"
                    aria-hidden="true"
                />
                <input
                    type="text"
                    placeholder={searchPlaceholder}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 text-sm text-black bg-transparent focus:outline-none placeholder-gray-400"
                    aria-label="Search"
                />
                <button
                    onClick={onFilterClick}
                    className="ml-2 p-1 rounded-full text-black hover:text-secondary-1 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-1"
                    aria-label="Filter options"
                >
                    <SlidersHorizontal size={18} /> {/* Changed from Filter to ListFilter */}
                </button>
            </div>

            {/* Menu button */}
            <button
                onClick={onMenuClick}
                className="p-2 rounded-md hover:bg-secondary-3 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-1"
                aria-label="Menu"
            >
                <Menu size={24} />
            </button>
        </header>
    );
};

export default Header;
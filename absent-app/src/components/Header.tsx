import { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface HeaderProps {
    className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header
            className={`sticky top-0 z-3000 bg-primary text-white shadow-md px-4 py-3 ${className}`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <a
                    href="/"
                    className="inline-flex items-center hover:text-secondary-1 transition-colors"
                    aria-label="Home"
                >
                    <img
                        src="/absent-text.svg"
                        alt="ABSENT"
                        className="h-6 w-auto"
                    />
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <a
                        href="/host-your-event"
                        className="hover:text-secondary-1 transition-colors font-semibold"
                    >
                        Host Your Event
                    </a>
                    <a
                        href="/post-your-venue"
                        className="hover:text-secondary-1 transition-colors font-semibold"
                    >
                        Post Your Venue
                    </a>
                    <a
                        href="/about"
                        className="hover:text-secondary-1 transition-colors font-semibold"
                    >
                        About
                    </a>
                    <a
                        href="/login"
                        className="bg-secondary-1 hover:bg-secondary-2 text-white px-4 py-2 rounded-md transition-colors font-semibold"
                    >
                        Login/Sign up
                    </a>
                </nav>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center space-x-4">
                    <a
                        href="/login"
                        className="bg-secondary-1 hover:bg-secondary-2 text-white px-3 py-1.5 text-sm rounded-md transition-colors font-semibold"
                    >
                        Login
                    </a>
                    <button
                        onClick={toggleMenu}
                        className="p-2 rounded-md hover:bg-secondary-3 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-1"
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-primary text-white flex flex-col items-center justify-center px-6">
                    {/* Close Button */}
                    <button
                        onClick={toggleMenu}
                        className="absolute top-5 right-5 p-2 rounded-md hover:bg-secondary-3 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-1"
                        aria-label="Close menu"
                    >
                        <X size={32} />
                    </button>

                    {/* Menu Items */}
                    <nav className="flex flex-col items-center space-y-6 text-lg font-semibold">
                        <a
                            href="/business"
                            className="hover:text-secondary-1 transition-colors"
                            onClick={toggleMenu}
                        >
                            For Business
                        </a>
                        <a
                            href="/about"
                            className="hover:text-secondary-1 transition-colors"
                            onClick={toggleMenu}
                        >
                            About
                        </a>
                        <a
                            href="/login"
                            className="bg-secondary-1 hover:bg-secondary-2 text-white px-6 py-2 rounded-md transition-colors"
                            onClick={toggleMenu}
                        >
                            Login / Sign Up
                        </a>
                    </nav>
                </div>
            )}

        </header>
    );
};

export default Header;
// src/components/Header.tsx
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    const confirmed = confirm('Are you sure you want to log out?');
    if (confirmed) logout();
  };

  const isBusiness = user?.role === 'business';
  const isAdmin = user?.role === 'admin';

  return (
    <header className={`sticky top-0 z-3000 bg-primary text-white shadow-md px-4 py-3 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="inline-flex items-center hover:text-secondary-1 transition-colors" aria-label="Home">
          <img src="/absent-text.svg" alt="ABSENT" className="h-6 w-auto" />
        </a>

        <nav className="hidden md:flex items-center space-x-6">
          <a href="/host-your-event" className="hover:text-secondary-1 transition-colors font-semibold">
            Host Your Event
          </a>
          <a href="/post-your-venue" className="hover:text-secondary-1 transition-colors font-semibold">
            Post Your Venue
          </a>
          <a href="/about" className="hover:text-secondary-1 transition-colors font-semibold">
            About
          </a>

          {!user ? (
            <a href="/login" className="bg-secondary-1 hover:bg-secondary-2 text-white px-4 py-2 rounded-md transition-colors font-semibold">
              Login/Sign up
            </a>
          ) : (
            <div className="relative group">
              <button className="w-10 h-10 rounded-full bg-white text-primary font-bold">
                {user.name.charAt(0).toUpperCase()}
              </button>
              <div className="absolute hidden group-hover:block bg-white text-primary shadow-lg right-0 mt-2 rounded-md p-2 text-sm w-40">
                <p className="px-4 py-2 font-medium">{user.name}</p>
                <hr className="my-1" />
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                {isBusiness && <a href="/my-venues" className="block px-4 py-2 hover:bg-gray-100">My Venues</a>}
                {isAdmin && <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Panel</a>}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Logout</button>
              </div>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center space-x-4">
          {!user ? (
            <a href="/login" className="bg-secondary-1 hover:bg-secondary-2 text-white px-3 py-1.5 text-sm rounded-md transition-colors font-semibold">
              Login
            </a>
          ) : (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-white text-primary font-bold">
                {user.name.charAt(0).toUpperCase()}
              </button>
              <div className="absolute right-0 mt-2 bg-white text-primary shadow-lg rounded-md p-2 text-sm w-36 hidden group-hover:block">
                <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                {isBusiness && <a href="/my-venues" className="block px-4 py-2 hover:bg-gray-100">My Venues</a>}
                {isAdmin && <a href="/admin" className="block px-4 py-2 hover:bg-gray-100">Admin Panel</a>}
                <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500">Logout</button>
              </div>
            </div>
          )}
          <button onClick={toggleMenu} className="p-2 rounded-md hover:bg-secondary-3 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-1" aria-label="Menu">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-primary text-white flex flex-col items-center justify-center px-6">
          <button onClick={toggleMenu} className="absolute top-5 right-5 p-2 rounded-md hover:bg-secondary-3 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-1" aria-label="Close menu">
            <X size={32} />
          </button>

          <nav className="flex flex-col items-center space-y-6 text-lg font-semibold">
            <a href="/host-your-event" className="hover:text-secondary-1 transition-colors font-semibold">
              Host Your Event
            </a>
            <a href="/post-your-venue" className="hover:text-secondary-1 transition-colors font-semibold">
              Post Your Venue
            </a>
            <a href="/about" className="hover:text-secondary-1 transition-colors" onClick={toggleMenu}>
              About
            </a>
            {!user ? (
              <a href="/login" className="bg-secondary-1 hover:bg-secondary-2 text-white px-6 py-2 rounded-md transition-colors" onClick={toggleMenu}>
                Login / Sign Up
              </a>
            ) : (
              <>
                <a href="/profile" className="hover:text-secondary-1 transition-colors" onClick={toggleMenu}>
                  Profile
                </a>
                {isBusiness && <a href="/my-venues" className="hover:text-secondary-1 transition-colors" onClick={toggleMenu}>My Venues</a>}
                {isAdmin && <a href="/admin" className="hover:text-secondary-1 transition-colors" onClick={toggleMenu}>Admin Panel</a>}
                <button onClick={handleLogout} className="bg-red-500 text-white mt-4 px-6 py-2 rounded-md hover:bg-red-600">
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;

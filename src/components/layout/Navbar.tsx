
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Search, Menu, Bell, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { logoutUser } from '@/lib/firebase';

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userData } = useAuth();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  return (
    <nav className="bg-black/95 shadow-md sticky top-0 z-40 text-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-bold text-anime-primary">Anime</span>
          <span className="text-2xl font-bold">Hub</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="hover:text-anime-primary transition">Home</Link>
          <Link to="/browse" className="hover:text-anime-primary transition">Browse</Link>
          <Link to="/watchlist" className="hover:text-anime-primary transition">My List</Link>
          <Link to="/ratings" className="hover:text-anime-primary transition">Ratings</Link>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search anime..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 bg-gray-800 text-white pr-10"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 h-full px-3 flex items-center justify-center"
            >
              <Search size={18} className="text-gray-400" />
            </button>
          </div>
        </form>

        {/* User Menu (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser.photoURL || undefined} alt={currentUser.displayName || 'User'} />
                    <AvatarFallback className="bg-anime-primary text-white">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/watchlist')}>
                  Watchlist
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate('/login')} className="hover:text-anime-primary">
                Login
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-anime-primary hover:bg-anime-secondary">
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 px-4 py-3 shadow-lg">
          <div className="flex flex-col space-y-4">
            <Link to="/" className="py-2 hover:text-anime-primary" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/browse" className="py-2 hover:text-anime-primary" onClick={() => setMobileMenuOpen(false)}>Browse</Link>
            <Link to="/watchlist" className="py-2 hover:text-anime-primary" onClick={() => setMobileMenuOpen(false)}>My List</Link>
            <Link to="/ratings" className="py-2 hover:text-anime-primary" onClick={() => setMobileMenuOpen(false)}>Ratings</Link>
            
            <form onSubmit={handleSearch} className="flex w-full py-2">
              <Input
                type="text"
                placeholder="Search anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white"
              />
              <Button type="submit" variant="ghost" className="ml-2">
                <Search size={18} />
              </Button>
            </form>
            
            {currentUser ? (
              <div className="flex flex-col space-y-2">
                <Link to="/profile" className="py-2 hover:text-anime-primary" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                <Button variant="ghost" onClick={handleLogout} className="text-left justify-start hover:text-anime-primary">
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Button variant="ghost" onClick={() => { navigate('/login'); setMobileMenuOpen(false); }} className="text-left justify-start">
                  Login
                </Button>
                <Button 
                  onClick={() => { navigate('/register'); setMobileMenuOpen(false); }}
                  className="bg-anime-primary hover:bg-anime-secondary w-full"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

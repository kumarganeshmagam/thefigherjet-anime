
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-anime-primary">Anime</span>
              <span className="text-2xl font-bold text-white">Hub</span>
            </Link>
            <p className="mt-4 text-sm">
              Your ultimate destination for anime streaming, with a huge library of series and movies.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Browse</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="hover:text-anime-primary">All Anime</Link></li>
              <li><Link to="/browse?genre=action" className="hover:text-anime-primary">Action</Link></li>
              <li><Link to="/browse?genre=romance" className="hover:text-anime-primary">Romance</Link></li>
              <li><Link to="/browse?genre=comedy" className="hover:text-anime-primary">Comedy</Link></li>
              <li><Link to="/browse?genre=drama" className="hover:text-anime-primary">Drama</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Help</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="hover:text-anime-primary">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-anime-primary">Contact Us</Link></li>
              <li><Link to="/terms" className="hover:text-anime-primary">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-anime-primary">Privacy Policy</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-anime-primary">Facebook</a></li>
              <li><a href="#" className="hover:text-anime-primary">Twitter</a></li>
              <li><a href="#" className="hover:text-anime-primary">Instagram</a></li>
              <li><a href="#" className="hover:text-anime-primary">Discord</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; 2025 AnimeHub. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Link to="/privacy" className="text-sm hover:text-anime-primary">Privacy</Link>
            <Link to="/terms" className="text-sm hover:text-anime-primary">Terms</Link>
            <Link to="/cookies" className="text-sm hover:text-anime-primary">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

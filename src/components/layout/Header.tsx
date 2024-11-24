import React, { useState } from 'react';
import { Bell, Settings, LogOut, User, Search } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPath = location.pathname.split('/')[2] || 'dashboard';
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('search', searchQuery);
    navigate(`/dashboard/${currentPath}?${searchParams.toString()}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 h-16">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </form>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="w-5 h-5 text-gray-600" />
          </button>
          <Link
            to="/dashboard/settings"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Settings className="w-5 h-5 text-gray-600" />
          </Link>
          <div className="flex items-center space-x-3 ml-4">
            <Link
              to="/dashboard/profile"
              className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              <User className="w-5 h-5" />
              <span>{user?.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
/* eslint-disable no-unused-vars */
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Plus, Home } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { toast } from 'sonner';

export function Layout({ children }) {
  const location = useLocation();
  const { exportJobs, importJobs } = useJobs();

  return (
    <div className="min-h-screen bg-gray-800/90 text-gray-100 ">
      <header className="bg-gray-900 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-indigo-400" />
              <span className="text-white text-lg font-semibold">JobProgress</span>
            </Link>
            
            <nav className="flex items-center gap-2 sm:gap-4">
             {/* Dashboard Link */}
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Home className="w-4 h-4" />
                {/* Show text only on sm and above */}
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              {/* Add Job Button */}
              <Link
                to="/add"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium whitespace-nowrap ${
                  location.pathname === '/add'
                    ? 'bg-indigo-700 text-white shadow-lg'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                }`}
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Job</span>
              </Link>
              
              
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
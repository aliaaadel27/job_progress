/* eslint-disable no-unused-vars */
import { Link, useLocation } from 'react-router-dom';
import { Briefcase, Plus, Download, Upload } from 'lucide-react';
import { useJobs } from '../context/JobContext';
import { toast } from 'sonner';

export function Layout({ children }) {
  const location = useLocation();
  const { exportJobs, importJobs } = useJobs();

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importJobs(file);
        
        toast.success('Jobs imported successfully!'); 
      } catch (error) {
        
        toast.error('Failed to import jobs. Please check the file format.'); 
      }
      // Reset the input
      e.target.value = '';
    }
  };

  const handleExport = () => {
    exportJobs();
  
    toast.success('Jobs exported successfully!'); 
  };

  return (
    <div className="min-h-screen bg-gray-800/90 text-gray-100">
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
                className={`px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                Dashboard
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
              
              {/* Import/Export Buttons */}
              <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-700">
                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  title="Export jobs" 
                >
                  <Upload className="w-5 h-5" />
                </button>
                
                {/* Import Button */}
                <label
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  title="Import jobs" 
                >
                  <Download className="w-5 h-5" />
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                  />
                </label>
              </div>
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
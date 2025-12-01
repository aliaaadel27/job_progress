import { useState, useMemo } from 'react';
import { useJobs } from '../context/JobContext';
import { JobCard } from '../components/JobCard';
import { Search, Filter, Briefcase, Download, Upload } from 'lucide-react';
import { toast } from 'sonner';


export function Dashboard() {
  const { jobs } = useJobs();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const { exportJobs, importJobs } = useJobs();


  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [jobs, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      applied: jobs.filter((j) => j.status === 'Applied').length,
      interviewing: jobs.filter((j) => j.status === 'Interviewing').length,
      offers: jobs.filter((j) => j.status === 'Offer').length,
      rejected: jobs.filter((j) => j.status === 'Rejected').length,
    };
  }, [jobs]);
  
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await importJobs(file);
        toast.success('Jobs imported successfully!'); 
      // eslint-disable-next-line no-unused-vars
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
    <div className="space-y-6">
      <div>
        <h1 className="text-white-950 mb-2">Job Applications Dashboard</h1>
        <p className="text-gray-400">Track and manage your job applications in one place</p>
      </div>
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

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-gray-600 text-sm">Total</p>
          <p className="text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
          <p className="text-blue-700 text-sm">Applied</p>
          <p className="text-blue-900 mt-1">{stats.applied}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-4">
          <p className="text-yellow-700 text-sm">Interviewing</p>
          <p className="text-yellow-900 mt-1">{stats.interviewing}</p>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4">
          <p className="text-green-700 text-sm">Offers</p>
          <p className="text-green-900 mt-1">{stats.offers}</p>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-4">
          <p className="text-red-700 text-sm">Rejected</p>
          <p className="text-red-900 mt-1">{stats.rejected}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
          <input
            type="text"
            placeholder="Search by company or job title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto pl-10 pr-8 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-gray-900"
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interviewing">Interviewing</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Job List */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-gray-900 mb-2">
            {jobs.length === 0 ? 'No job applications yet' : 'No matching applications'}
          </h3>
          <p className="text-gray-600">
            {jobs.length === 0
              ? 'Start tracking your job applications by adding your first one.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}

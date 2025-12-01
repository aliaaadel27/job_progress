import { Link } from 'react-router-dom';
import { Building2, Calendar, ChevronRight } from 'lucide-react';

const statusColors = {
  Applied: 'bg-blue-100 text-blue-700',
  Interviewing: 'bg-yellow-100 text-yellow-700',
  Offer: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-700',
};

export function JobCard({ job }) {
  const formattedDate = new Date(job.applicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      to={`/job/${job.id}`}
      className="block bg-white/80 rounded-lg border border-gray-200 p-4 sm:p-6 hover:border-blue-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gray-100 rounded-lg shrink-0">
              <Building2 className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-gray-900 truncate">{job.jobTitle}</h3>
              <p className="text-gray-600 truncate mt-1">{job.companyName}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-4">
            <span className={`px-3 py-1 rounded-full text-sm ${statusColors[job.status]}`}>
              {job.status}
            </span>
            <div className="flex items-center gap-1 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 mt-1" />
      </div>
    </Link>
  );
}

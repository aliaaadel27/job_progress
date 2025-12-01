import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { ArrowLeft, Edit, Trash2, Building2, Calendar, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const statusColors = {
  Applied: 'bg-blue-100 text-blue-700 border-blue-200',
  Interviewing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Offer: 'bg-green-100 text-green-700 border-green-200',
  Rejected: 'bg-red-100 text-red-700 border-red-200',
};

export function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getJobById, deleteJob } = useJobs();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const job = id ? getJobById(id) : undefined;

  if (!job) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <h2 className="text-gray-900 mb-2">Job Application Not Found</h2>
          <p className="text-gray-600 mb-6">
            The job application you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(job.applicationDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleDelete = () => {
    if (id) {
      deleteJob(id);
      toast.success('Job application deleted successfully!');
      navigate('/');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-white hover:text-gray-300 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="bg-white/90 rounded-lg border overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-8 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-gray-900 mb-2 text-3xl">{job.jobTitle}</h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Building2 className="w-5 h-5" />
                <span>{job.companyName}</span>
              </div>
            </div>
            <span
              className={`px-4 py-2 rounded-lg border text-center ${statusColors[job.status]}`}
            >
              {job.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span>Applied on {formattedDate}</span>
          </div>
        </div>

        {/* Notes */}
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-gray-600" />
            <h2 className="text-gray-900">Notes</h2>
          </div>
          {job.notes ? (
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
              {job.notes}
            </div>
          ) : (
            <p className="text-gray-500 italic">No notes added for this application.</p>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 sm:p-8 bg-gray-800/20 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Application
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center justify-center gap-2 px-6 py-2 border bg-red-700/70 text-white rounded-lg hover:bg-red-800 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Application
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-gray-900 mb-2">Delete Job Application?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job application? This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

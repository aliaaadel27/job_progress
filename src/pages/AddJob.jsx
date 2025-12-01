import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJobs } from '../context/JobContext';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

export function AddJob() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addJob, updateJob, getJobById } = useJobs();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    status: 'Applied',
    applicationDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && id) {
      const job = getJobById(id);
      if (job) {
        setFormData({
          companyName: job.companyName,
          jobTitle: job.jobTitle,
          status: job.status,
          applicationDate: job.applicationDate,
          notes: job.notes,
        });
      } else {
        navigate('/');
      }
    }
  }, [id, isEditing, getJobById, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }
    if (!formData.applicationDate) {
      newErrors.applicationDate = 'Application date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isEditing && id) {
      updateJob(id, formData);
      toast.success('Job application updated successfully!');
    } else {
      addJob(formData);
      toast.success('Job application added successfully!');
    }

    navigate('/');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white hover:text-gray-200 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white/90 rounded-lg border border-gray-200 p-6 sm:p-8">
        <h1 className="text-gray-900 mb-2 text-2xl">
          {isEditing ? 'Edit Job Application' : 'Add New Job Application'}
        </h1>
        <p className="text-gray-600 mb-8">
          {isEditing
            ? 'Update the details of your job application'
            : 'Fill in the details of your job application'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="companyName" className="block text-gray-900 mb-2">
              Company Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              className={`w-full px-4 py-2  text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.companyName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Google"
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
            )}
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-gray-900 mb-2">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="jobTitle"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              className={`w-full px-4 py-2 text-black border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.jobTitle ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Senior Frontend Developer"
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
            )}
          </div>

          <div>
            <label htmlFor="status" className="block text-gray-900 mb-2">
              Application Status <span className="text-red-500">*</span>
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300  text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Applied">Applied</option>
              <option value="Interviewing">Interviewing</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label htmlFor="applicationDate" className="block text-gray-900 mb-2">
              Application Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="applicationDate"
              name="applicationDate"
              value={formData.applicationDate}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full px-4 py-2 border rounded-lg  text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.applicationDate ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.applicationDate && (
              <p className="text-red-500 text-sm mt-1">{errors.applicationDate}</p>
            )}
          </div>

          <div>
            <label htmlFor="notes" className="block text-gray-900 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={5}
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add any additional notes about this application..."
            />
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isEditing ? 'Update Application' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
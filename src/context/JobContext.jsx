import { createContext, useContext, useState, useEffect } from 'react';
import { normalizeStatus } from '../utils/status'; // <-- ضيفي هذا الاستيراد في أعلى الملف

const JobContext = createContext(undefined);

const STORAGE_KEY = 'job-applications';

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState([]);

  // Load jobs from localStorage on mount
  useEffect(() => {
    const storedJobs = localStorage.getItem(STORAGE_KEY);
    if (storedJobs) {
      try {
        setJobs(JSON.parse(storedJobs));
      } catch (error) {
        console.error('Error loading jobs from localStorage:', error);
      }
    }
  }, []);

  // Save jobs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  const addJob = (job) => {
    const newJob = {
      ...job,
      id: crypto.randomUUID(),
    };
    setJobs((prev) => [...prev, newJob]);
  };

  const updateJob = (id, updatedJob) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...updatedJob, id } : job))
    );
  };

  const deleteJob = (id) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  const getJobById = (id) => {
    return jobs.find((job) => job.id === id);
  };

  const exportJobs = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // const importJobs = (file) => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       try {
  //         const content = e.target?.result;
  //         const importedJobs = JSON.parse(content);

  //         // Validate the imported data
  //         if (!Array.isArray(importedJobs)) {
  //           reject(new Error('Invalid file format'));
  //           return;
  //         }

  //         // Merge imported jobs with existing ones, deduping by id or by (companyName, jobTitle, applicationDate)
  //         setJobs((prev) => {
  //           // Create a map of existing jobs keyed by id
  //           const byId = new Map(prev.map((j) => [j.id, j]));

  //           // Also index by composite key for entries that don't have ids or to detect duplicates
  //           const byComposite = new Map();
  //           prev.forEach((j) => {
  //             const comp = `${j.companyName}::${j.jobTitle}::${j.applicationDate || ''}`;
  //             byComposite.set(comp, j.id);
  //           });

  //           for (const rawJob of importedJobs) {
  //             if (!rawJob || typeof rawJob !== 'object') {
  //               // Skip invalid entries
  //               continue;
  //             }

  //             const job = { ...rawJob };

  //             // Ensure every job has an ID
  //             if (!job.id) {
  //               job.id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  //             }

  //             // If an existing job with the same id exists, replace/update it with the imported one
  //             if (byId.has(job.id)) {
  //               byId.set(job.id, job);
  //               const comp = `${job.companyName}::${job.jobTitle}::${job.applicationDate || ''}`;
  //               byComposite.set(comp, job.id);
  //               continue;
  //             }

  //             // If an existing job with the same composite key exists, update that existing job (avoid duplicates)
  //             const comp = `${job.companyName}::${job.jobTitle}::${job.applicationDate || ''}`;
  //             if (byComposite.has(comp)) {
  //               const existingId = byComposite.get(comp);
  //               byId.set(existingId, { ...job, id: existingId });
  //               continue;
  //             }

  //             // Otherwise add as a new job
  //             byId.set(job.id, job);
  //             byComposite.set(comp, job.id);
  //           }

  //           return Array.from(byId.values());
  //         });

  //         resolve();
  //       } catch (error) {
  //         reject(error);
  //       }
  //     };
  //     reader.onerror = () => reject(new Error('Error reading file'));
  //     reader.readAsText(file);
  //   });
  // };

  const importJobs = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result;
          const importedJobs = JSON.parse(content);

          // Validate the imported data
          if (!Array.isArray(importedJobs)) {
            reject(new Error('Invalid file format'));
            return;
          }

          // Merge imported jobs with existing ones, deduping by id or by (companyName, jobTitle, applicationDate)
          setJobs((prev) => {
            // Create a map of existing jobs keyed by id
            const byId = new Map(prev.map((j) => [j.id, j]));

            // Also index by composite key for entries that don't have ids or to detect duplicates
            const byComposite = new Map();
            prev.forEach((j) => {
              const comp = `${j.companyName}::${j.jobTitle}::${j.applicationDate || ''}`;
              byComposite.set(comp, j.id);
            });

            for (const rawJob of importedJobs) {
              if (!rawJob || typeof rawJob !== 'object') {
                // Skip invalid entries
                continue;
              }

              // Create a shallow copy and normalize fields BEFORE merging
              const job = {
                ...rawJob,
                companyName: rawJob.companyName ?? '',
                jobTitle: rawJob.jobTitle ?? '',
                // Normalize status here (THE KEY)
                status: normalizeStatus(rawJob.status),
                // Ensure a valid date string (fallback to today)
                applicationDate: rawJob.applicationDate ?? new Date().toISOString().split('T')[0],
                notes: rawJob.notes ?? '',
              };

              // Ensure every job has an ID (after normalizing)
              if (!job.id) {
                job.id = typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
              }

              // If an existing job with the same id exists, replace/update it with the imported one
              if (byId.has(job.id)) {
                byId.set(job.id, job);
                const comp = `${job.companyName}::${job.jobTitle}::${job.applicationDate || ''}`;
                byComposite.set(comp, job.id);
                continue;
              }

              // If an existing job with the same composite key exists, update that existing job (avoid duplicates)
              const comp = `${job.companyName}::${job.jobTitle}::${job.applicationDate || ''}`;
              if (byComposite.has(comp)) {
                const existingId = byComposite.get(comp);
                // keep existingId but replace fields with normalized job
                byId.set(existingId, { ...job, id: existingId });
                continue;
              }

              // Otherwise add as a new job
              byId.set(job.id, job);
              byComposite.set(comp, job.id);
            }

            const next = Array.from(byId.values());
            try {
              localStorage.setItem('jobs', JSON.stringify(next));
            } catch (e) {
              console.error('Failed to save jobs to localStorage', e);
            }
            return next;
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error reading file'));
      reader.readAsText(file);
    });
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        addJob,
        updateJob,
        deleteJob,
        getJobById,
        exportJobs,
        importJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
}
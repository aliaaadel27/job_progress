import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { JobProvider } from './context/JobContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { AddJob } from './pages/AddJob';
import { JobDetails } from './pages/JobDetails';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <Router>
      <JobProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddJob />} />
            <Route path="/job/:id" element={<JobDetails />} />
            <Route path="/edit/:id" element={<AddJob />} />
          </Routes>
        </Layout>
        <Toaster position="top-right" richColors />
      </JobProvider>
    </Router>
  );
}

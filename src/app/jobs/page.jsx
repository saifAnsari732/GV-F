import React from 'react';
import JobsClient from './JobsClient';
import { API_URL } from '../../helper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Job Vacancies in Fazilnagar & Tamkuhi | GV Computer Center',
  description: 'Find the latest private jobs, computer operator jobs, and IT vacancies in Fazilnagar, Tamkuhi Raj, Kasaya, and Kushinagar.',
  keywords: 'Jobs in Fazilnagar, Latest jobs in Tamkuhi Raj, Computer operator jobs Kasaya, Private jobs in Kushinagar, Vacancies in Padrauna, Data entry jobs near me, IT jobs Gorakhpur, GV Computer Center jobs, employment in Dhanauji Kalon',
};

async function getJobs() {
  try {
    const res = await fetch(`${API_URL}/api/jobs`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 selection:bg-indigo-500/30">
      <JobsClient initialJobs={jobs} />
    </div>
  );
}
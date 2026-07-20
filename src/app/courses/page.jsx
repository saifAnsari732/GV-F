import React from 'react';
import CoursesClient from './CoursesClient';
import { API_URL } from '../../helper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Computer Courses in Fazilnagar, Tamkuhi, Kasaya | GV Computer Center',
  description: 'Join DCA, ADCA, Tally Prime, CCC, O Level, Web Development & more courses at GV Computer Center — top-rated institute in Fazilnagar, Tamkuhi Raj, Kasaya & Kushinagar.',
  keywords: 'DCA course in Fazilnagar, ADCA classes near me, Tally Prime with GST in Tamkuhi, CCC certification Kasaya, O Level course Kushinagar, Diploma in Computer Application UP, ADCA computer center Padrauna, Web Development class in Fazilnagar, Best computer course near me, IT training institute Kushinagar district',
};

async function getCourses() {
  try {
    const res = await fetch(`${API_URL}/api/courses`, {
      cache: 'no-store'
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 selection:bg-cyan-500/30">
      <CoursesClient initialCourses={courses} />
    </div>
  );
}
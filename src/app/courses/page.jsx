import React from 'react';
import CoursesClient from './CoursesClient';
import { API_URL } from '../../helper';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Courses | GV Computer Center',
  description: 'Explore our comprehensive computer training programs designed to launch your tech career. From basics to advanced programming with industry-recognized certifications.',
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
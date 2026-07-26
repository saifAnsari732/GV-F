"use client";
import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { FaUser, FaPhoneAlt, FaGraduationCap, FaMapMarkerAlt, FaCalendarAlt, FaEnvelopeOpenText } from 'react-icons/fa';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await api.get('/api/enquiries');
      if (res.data.success) {
        setEnquiries(res.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-10 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 font-['Syne',sans-serif]">Student Enquiries</h1>
            <p className="text-gray-500 mt-2 font-medium">Manage and view all incoming student enquiries.</p>
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-sm font-bold text-gray-700">
            Total Enquiries: <span className="text-blue-600">{enquiries.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-3xl h-48 animate-pulse" />
            ))}
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
            <FaEnvelopeOpenText className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900">No Enquiries Found</h3>
            <p className="text-gray-500 mt-2">When students submit an enquiry, it will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enquiries.map((enq) => (
              <div key={enq._id} className="bg-white border border-gray-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                
                <div className="flex justify-between items-start mb-4 pl-2">
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">{enq.name}</h3>
                  <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider border shrink-0 ${
                    enq.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    enq.status === 'contacted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {enq.status || 'pending'}
                  </span>
                </div>

                <div className="space-y-3 pl-2">
                  <div className="flex items-center gap-3 text-sm">
                    <FaPhoneAlt className="text-gray-400 shrink-0" />
                    <a href={`tel:${enq.phone}`} className="text-gray-700 font-semibold hover:text-blue-600 transition-colors">{enq.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FaGraduationCap className="text-gray-400 shrink-0" />
                    <span className="text-gray-700 font-semibold">{enq.course}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <FaMapMarkerAlt className="text-gray-400 mt-1 shrink-0" />
                    <span className="text-gray-600">{enq.address}</span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center pl-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <FaCalendarAlt />
                    {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import '../../styles/AttendanceManagement.css';
import api from '../../services/api';

const SimpleAttendance = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeCourseTab, setActiveCourseTab] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchStudentsByCourse();
    }
  }, [selectedCourse, selectedDate]);

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("courses", response.data);
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch courses');
    }
  };

  const fetchStudentsByCourse = async () => {
    if (!selectedCourse) return;
    
    setFetchLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      console.log("Fetching students for course:", selectedCourse);
      
      // Fetch all students (since API might not be filtering properly)
      const response = await api.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("All students response:", response.data);

      if (response.data.success) {
        const allStudents = response.data.data;
        
        // Filter students who are enrolled in the selected course
        const enrolledStudents = allStudents.filter(student => {
          // Check if student has courseNames array
          if (!student.courseNames || !Array.isArray(student.courseNames)) {
            return false;
          }
          
          // Check if any enrollment has the selected course ID
          return student.courseNames.some(enrollment => {
            // Handle both populated and unpopulated course references
            const courseId = enrollment.course?._id || enrollment.course;
            return courseId && courseId.toString() === selectedCourse.toString();
          });
        });

        console.log("Filtered enrolled students for course", selectedCourse, ":", enrolledStudents);
        
        if (enrolledStudents.length === 0) {
          setAttendanceData([]);
          setFetchLoading(false);
          return;
        }
        
        // Fetch existing attendance for selected date
        try {
          const attendanceResponse = await api.get(
            `/api/attendance/course/${selectedCourse}?date=${selectedDate}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          console.log("Attendance response:", attendanceResponse.data);

          // Create attendance data array
          const data = enrolledStudents.map((student, index) => {
            const existingAttendance = attendanceResponse.data.success && attendanceResponse.data.data
              ? attendanceResponse.data.data.find(a => a.student?._id === student._id)
              : null;

            return {
              id: student._id,
              srNo: index + 1,
              name: student.name || 'Unknown',
              present: existingAttendance ? existingAttendance.status === 'present' : false,
              absent: existingAttendance ? existingAttendance.status === 'absent' : false,
              late: existingAttendance ? existingAttendance.status === 'late' : false,
              attendanceId: existingAttendance?._id || null
            };
          });

          console.log("Attendance data prepared:", data);
          setAttendanceData(data);
        } catch (attendanceErr) {
          console.log('No existing attendance found for this date');
          const data = enrolledStudents.map((student, index) => ({
            id: student._id,
            srNo: index + 1,
            name: student.name || 'Unknown',
            present: false,
            absent: false,
            late: false,
            attendanceId: null
          }));
          setAttendanceData(data);
        }
      }
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to fetch students. Please try again.');
      setAttendanceData([]);
    } finally {
      setFetchLoading(false);
    }
  };

  // Rest of your handlers (handlePresentChange, handleAbsentChange, etc.)
  const handlePresentChange = (studentId, checked) => {
    setAttendanceData(prevData => 
      prevData.map(student => 
        student.id === studentId 
          ? { ...student, present: checked, absent: false, late: false }
          : student
      )
    );
  };

  const handleAbsentChange = (studentId, checked) => {
    setAttendanceData(prevData => 
      prevData.map(student => 
        student.id === studentId 
          ? { ...student, absent: checked, present: false, late: false }
          : student
      )
    );
  };

  const handleLateChange = (studentId, checked) => {
    setAttendanceData(prevData => 
      prevData.map(student => 
        student.id === studentId 
          ? { ...student, late: checked, present: false, absent: false }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setAttendanceData(prevData => 
      prevData.map(student => ({
        ...student,
        present: true,
        absent: false,
        late: false
      }))
    );
  };

  const markAllAbsent = () => {
    setAttendanceData(prevData => 
      prevData.map(student => ({
        ...student,
        present: false,
        absent: true,
        late: false
      }))
    );
  };

  const clearAll = () => {
    setAttendanceData(prevData => 
      prevData.map(student => ({
        ...student,
        present: false,
        absent: false,
        late: false
      }))
    );
  };

  const submitAttendance = async () => {
    if (!selectedCourse) {
      setError('Please select a course');
      return;
    }

    const markedStudents = attendanceData.filter(s => s.present || s.absent || s.late);
    if (markedStudents.length === 0) {
      setError('Please mark attendance for at least one student');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      
      const attendancePayload = attendanceData
        .filter(student => student.present || student.absent || student.late)
        .map(student => ({
          studentId: student.id,
          status: student.present ? 'present' : student.absent ? 'absent' : 'late',
          date: selectedDate,
          courseId: selectedCourse,
          remarks: ''
        }));

      const response = await api.post(
        '/api/attendance/bulk',
        {
          courseId: selectedCourse,
          date: selectedDate,
          attendanceData: attendancePayload
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setSuccess('Attendance saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
        fetchStudentsByCourse();
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.message || 'Failed to save attendance');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (courseId, courseName) => {
    setSelectedCourse(courseId);
    setActiveCourseTab(courseName);
  };

  const presentCount = attendanceData.filter(s => s.present).length;
  const absentCount = attendanceData.filter(s => s.absent).length;
  const lateCount = attendanceData.filter(s => s.late).length;
  const totalStudents = attendanceData.length;

  return (
    <div className="simple-attendance">
      <div className="attendance-header">
        <h1>📋 Mark Attendance</h1>
        <p>Select course and mark student attendance</p>
      </div>

      {/* Course Tabs */}
      <div className="course-tabs">
        {courses.map(course => (
          <button
            key={course._id}
            className={`course-tab ${activeCourseTab === course.courseName ? 'active' : ''}`}
            onClick={() => handleCourseSelect(course._id, course.courseName)}
          >
            <span className="course-tab-name">{course.courseName}</span>
            <span className="course-tab-code">{course.courseCode}</span>
          </button>
        ))}
      </div>

      {/* Date Selection */}
      <div className="date-section">
        <label>Select Date:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
          max={new Date().toISOString().split('T')[0]}
        />
        <button 
          onClick={fetchStudentsByCourse} 
          className="btn-refresh" 
          disabled={!selectedCourse || fetchLoading}
        >
          {fetchLoading ? 'Loading...' : '🔄 Load Students'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {selectedCourse && (
        <>
          {/* Course Info */}
          <div className="course-info">
            <h2>{courses.find(c => c._id === selectedCourse)?.courseName}</h2>
            <p>Course Code: {courses.find(c => c._id === selectedCourse)?.courseCode}</p>
          </div>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card total">
              <span className="summary-label">Total Students</span>
              <span className="summary-value">{totalStudents}</span>
            </div>
            <div className="summary-card present">
              <span className="summary-label">Present</span>
              <span className="summary-value">{presentCount}</span>
            </div>
            <div className="summary-card absent">
              <span className="summary-label">Absent</span>
              <span className="summary-value">{absentCount}</span>
            </div>
            <div className="summary-card late">
              <span className="summary-label">Late</span>
              <span className="summary-value">{lateCount}</span>
            </div>
          </div>

          {/* Quick Actions */}
          {totalStudents > 0 && !fetchLoading && (
            <div className="quick-actions">
              <button onClick={markAllPresent} className="btn-quick present">
                ✅ Mark All Present
              </button>
              <button onClick={markAllAbsent} className="btn-quick absent">
                ❌ Mark All Absent
              </button>
              <button onClick={clearAll} className="btn-quick clear">
                🔄 Clear All
              </button>
            </div>
          )}

          {/* Students Table */}
          {fetchLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : (
            <div className="students-table-container">
              {totalStudents > 0 ? (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student Name</th>
                      <th>Present</th>
                      <th>Absent</th>
                      <th>Late</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map(student => (
                      <tr key={student.id}>
                        <td>{student.srNo}</td>
                        <td>{student.name}</td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.present}
                            onChange={(e) => handlePresentChange(student.id, e.target.checked)}
                            disabled={loading}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.absent}
                            onChange={(e) => handleAbsentChange(student.id, e.target.checked)}
                            disabled={loading}
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            checked={student.late}
                            onChange={(e) => handleLateChange(student.id, e.target.checked)}
                            disabled={loading}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="no-students">
                  <p>No students enrolled in this course</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          {totalStudents > 0 && !fetchLoading && (
            <div className="submit-section">
              <button 
                onClick={submitAttendance} 
                disabled={loading}
                className="btn-submit"
              >
                {loading ? 'Saving...' : '💾 Save Attendance'}
              </button>
            </div>
          )}
        </>
      )}

      {!selectedCourse && (
        <div className="no-course-selected">
          <p>Please select a course from above to mark attendance</p>
        </div>
      )}
    </div>
  );
};

export default SimpleAttendance;
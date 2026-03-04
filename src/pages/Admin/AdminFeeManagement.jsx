/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../../styles/AdminFeeManagement.css';
const AdminFeeManagement = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMode: 'Cash',
    transactionId: '',
    remarks: ''
  });
  const [createFeeData, setCreateFeeData] = useState({
    studentId: '',
    courseId: '',
    totalFees: '',
    paidAmount: '',
    paymentMode: 'Cash',
    transactionId: '',
    remarks: ''
  });
  const [statistics, setStatistics] = useState({
    totalFees: 0,
    totalPaid: 0, 
    totalPending: 0,
    totalStudents: 0,
    fullyPaid: 0,
    partiallyPaid: 0,
    pending: 0
  });

  useEffect(() => {
    fetchData();
    fetchCourses();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all students
      const studentsResponse = await axios.get('/api/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (studentsResponse.data.success) {
        const studentsData = studentsResponse.data.data;
        setStudents(studentsData);
        
        // Fetch all fee records
        const feesResponse = await axios.get('/api/fees', {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("fee response:", feesResponse.data);
        
        if (feesResponse.data.success) {
          const feesData = feesResponse.data.data;
          console.log("fees data:", feesData);
          setFees(feesData);
          calculateStatistics(feesData, studentsData);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setCourses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const calculateStatistics = (feesData, studentsData) => {
    // Calculate totals from fee records
    let totalFees = 0;
    let totalPaid = 0;
    let totalPending = 0;
    
    feesData.forEach(fee => {
      // Safely add amounts, ensuring they're numbers
      totalFees += Number(fee.totalFees) || 0;
      totalPaid += Number(fee.paidAmount) || 0;
      totalPending += Number(fee.pendingAmount) || 0;
    });

    // Count statuses
    const fullyPaid = feesData.filter(fee => fee.status === 'paid').length;
    const partiallyPaid = feesData.filter(fee => fee.status === 'partial').length;
    const pending = feesData.filter(fee => fee.status === 'pending').length;

    console.log('Calculated statistics:', {
      totalFees,
      totalPaid,
      totalPending,
      fullyPaid,
      partiallyPaid,
      pending
    });

    setStatistics({
      totalFees,
      totalPaid,
      totalPending,
      totalStudents: studentsData.length,
      fullyPaid,
      partiallyPaid,
      pending
    });
  };

  const handleAddPayment = async (feeId) => {
    try {
      // Validate amount
      if (!paymentData.amount || paymentData.amount <= 0) {
        toast.error('Please enter a valid amount');
        return;
      }

      const token = localStorage.getItem('token');
      
      const response = await axios.post(`/api/fees/${feeId}/payment`, {
        amount: parseFloat(paymentData.amount),
        paymentMode: paymentData.paymentMode,
        transactionId: paymentData.transactionId || undefined,
        remarks: paymentData.remarks || undefined
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Payment added successfully');
        setShowPaymentModal(false);
        setPaymentData({
          amount: '',
          paymentMode: 'Cash',
          transactionId: '',
          remarks: ''
        });
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error adding payment:', error);
      toast.error(error.response?.data?.message || 'Failed to add payment');
    }
  };

  const handleCreateFee = async () => {
    try {
      // Validate form
      if (!createFeeData.studentId || !createFeeData.courseId || !createFeeData.totalFees) {
        toast.error('Please fill all required fields');
        return;
      }

      // Validate total fees
      const totalFees = parseFloat(createFeeData.totalFees);
      if (isNaN(totalFees) || totalFees <= 0) {
        toast.error('Please enter a valid total fees amount');
        return;
      }

      // Validate paid amount if provided
      let paidAmount = 0;
      if (createFeeData.paidAmount) {
        paidAmount = parseFloat(createFeeData.paidAmount);
        if (isNaN(paidAmount) || paidAmount < 0) {
          toast.error('Please enter a valid paid amount');
          return;
        }
        if (paidAmount > totalFees) {
          toast.error('Paid amount cannot be greater than total fees');
          return;
        }
      }

      const token = localStorage.getItem('token');
      
      const feeData = {
        studentId: createFeeData.studentId,
        courseId: createFeeData.courseId,
        totalFees: totalFees,
        paidAmount: paidAmount,
        paymentMode: paidAmount > 0 ? createFeeData.paymentMode : undefined,
        transactionId: paidAmount > 0 ? createFeeData.transactionId : undefined,
        remarks: createFeeData.remarks || undefined
      };

      console.log('Creating fee record with data:', feeData);

      const response = await axios.post('/api/fees', feeData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Fee record created successfully');
        setShowCreateModal(false);
        setCreateFeeData({
          studentId: '',
          courseId: '',
          totalFees: '',
          paidAmount: '',
          paymentMode: 'Cash',
          transactionId: '',
          remarks: ''
        });
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error creating fee record:', error);
      toast.error(error.response?.data?.message || 'Failed to create fee record');
    }
  };

  const getStudentFees = (studentId) => {
    return fees.filter(fee => {
      // Handle both populated and unpopulated student fields
      const feeStudentId = fee.student?._id || fee.student;
      return feeStudentId === studentId;
    });
  };

  const getStudentTotalFees = (studentId) => {
    const studentFees = getStudentFees(studentId);
    return studentFees.reduce((sum, fee) => sum + (Number(fee.totalFees) || 0), 0);
  };

  const getStudentPaidFees = (studentId) => {
    const studentFees = getStudentFees(studentId);
    return studentFees.reduce((sum, fee) => sum + (Number(fee.paidAmount) || 0), 0);
  };

  const getStudentPendingFees = (studentId) => {
    const studentFees = getStudentFees(studentId);
    return studentFees.reduce((sum, fee) => sum + (Number(fee.pendingAmount) || 0), 0);
  };

  const getStudentFeeStatus = (studentId) => {
    const studentFees = getStudentFees(studentId);
    if (studentFees.length === 0) return 'no-fees';
    
    const allPaid = studentFees.every(fee => fee.status === 'paid');
    const anyPending = studentFees.some(fee => fee.status === 'pending');
    
    if (allPaid) return 'paid';
    if (anyPending) return 'pending';
    return 'partial';
  };

  const getStatusBadge = (status) => {
  const config = {
    'paid':    { bg: 'bg-green-100',  text: 'text-green-800',  label: '✓ Fully Paid' },
    'partial': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: '◑ Partial'    },
    'pending': { bg: 'bg-red-100',    text: 'text-red-800',    label: '○ Pending'    },
    'no-fees': { bg: 'bg-gray-100',   text: 'text-gray-800',   label: '— No Fees'    }
  };
  const { bg, text, label } = config[status] || config['no-fees'];
  return <span className={`status-badge ${bg} ${text}`}>{label}</span>;
};

  const formatCurrency = (amount) => {
    if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.phone?.includes(searchTerm);
    
    if (statusFilter === 'all') return matchesSearch;
    
    const studentStatus = getStudentFeeStatus(student._id);
    return matchesSearch && studentStatus === statusFilter;
  });

  if (loading) {
    return (
      <div className="fee-loading-container">
        <div className="fee-loading-spinner"></div>
        <p>Loading fee management data...</p>
      </div>
    );
  }

  return (
    <div className="admin-fee-container">
      {/* Header */}
      <div className="admin-fee-header">
        <div className="header-content">
          <h1>Fee Management</h1>
          <p>Manage student fees and payments</p>
        </div>
        <div className="header-buttons">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="create-btn"
          >
            + Create Fee Record
          </button>
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="back-btn"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <h3>Total Fees</h3>
            <p className="stat-value">{formatCurrency(statistics.totalFees)}</p>
          </div>
        </div>
        
        <div className="stat-card paid">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <h3>Total Paid</h3>
            <p className="stat-value">{formatCurrency(statistics.totalPaid)}</p>
          </div>
        </div>
        
        <div className="stat-card pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-details">
            <h3>Total Pending</h3>
            <p className="stat-value">{formatCurrency(statistics.totalPending)}</p>
          </div>
        </div>
        
        <div className="stat-card students">
          <div className="stat-icon">👥</div>
          <div className="stat-details">
            <h3>Total Students</h3>
            <p className="stat-value">{statistics.totalStudents}</p>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="status-summary">
        <div className="summary-item">
          <span className="dot green"></span>
          <span>Fully Paid: {statistics.fullyPaid}</span>
        </div>
        <div className="summary-item">
          <span className="dot yellow"></span>
          <span>Partial: {statistics.partiallyPaid}</span>
        </div>
        <div className="summary-item">
          <span className="dot red"></span>
          <span>Pending: {statistics.pending}</span>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by student name, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        
        <select 
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="paid">Fully Paid</option>
          <option value="partial">Partial</option>
          <option value="pending">Pending</option>
          <option value="no-fees">No Fees</option>
        </select>
      </div>

      {/* Students Fee Table */}
      <div className="students-table-container">
        {filteredStudents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No students found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          <table className="students-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Contact</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(student => {
                const totalFee = getStudentTotalFees(student._id);
                const paidFee = getStudentPaidFees(student._id);
                const pendingFee = getStudentPendingFees(student._id);
                const status = getStudentFeeStatus(student._id);
                
                return (
                  <tr key={student._id}>
                    <td>
                      <div className="student-info">
                        <div className="student-avatar">
                          {student.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="student-name">{student.name}</div>
                          <div className="student-id">ID: {student._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="contact-info">
                        <div>{student.email}</div>
                        <div className="phone">{student.phone}</div>
                      </div>
                    </td>
                    <td className="amount">{formatCurrency(totalFee)}</td>
                    <td className="amount paid">{formatCurrency(paidFee)}</td>
                    <td className="amount pending">{formatCurrency(pendingFee)}</td>
                    <td>{getStatusBadge(status)}</td>
                    <td>
                      <button 
                        className="view-btn"
                        onClick={() => {
                          setSelectedStudent(student);
                          setShowPaymentModal(true);
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Debug Info - Remove in production */}
      <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs">
        <h4 className="font-bold mb-2">Debug Info:</h4>
        <p>Total Students: {students.length}</p>
        <p>Total Fee Records: {fees.length}</p>
        <p>Total Fees Amount: {formatCurrency(statistics.totalFees)}</p>
        <p>Total Paid Amount: {formatCurrency(statistics.totalPaid)}</p>
        <p>Total Pending Amount: {formatCurrency(statistics.totalPending)}</p>
      </div>

      {/* Create Fee Record Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content create-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Fee Record</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <form onSubmit={(e) => { e.preventDefault(); handleCreateFee(); }}>
                {/* Student Selection */}
                <div className="form-group">
                  <label>Select Student *</label>
                  <select
                    value={createFeeData.studentId}
                    onChange={(e) => setCreateFeeData({...createFeeData, studentId: e.target.value})}
                    required
                    className="form-select"
                  >
                    <option value="">Choose a student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.name} - {student.email}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course Selection */}
                <div className="form-group">
                  <label>Select Course *</label>
                  <select
                    value={createFeeData.courseId}
                    onChange={(e) => {
                      const selectedCourse = courses.find(c => c._id === e.target.value);
                      setCreateFeeData({
                        ...createFeeData,
                        courseId: e.target.value,
                        totalFees: selectedCourse?.fees || ''
                      });
                    }}
                    required
                    className="form-select"
                  >
                    <option value="">Choose a course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.courseName} - {course.courseCode} (₹{course.fees})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Total Fees */}
                <div className="form-group">
                  <label>Total Fees (₹) *</label>
                  <input
                    type="number"
                    value={createFeeData.totalFees}
                    onChange={(e) => setCreateFeeData({...createFeeData, totalFees: e.target.value})}
                    required
                    min="1"
                    step="1"
                    className="form-input"
                    placeholder="Enter total fees"
                  />
                </div>

                {/* Initial Payment */}
                <div className="form-group">
                  <label>Initial Payment Amount (₹) (Optional)</label>
                  <input
                    type="number"
                    value={createFeeData.paidAmount}
                    onChange={(e) => setCreateFeeData({...createFeeData, paidAmount: e.target.value})}
                    min="0"
                    step="1"
                    className="form-input"
                    placeholder="Enter initial payment"
                  />
                  {createFeeData.paidAmount && parseFloat(createFeeData.paidAmount) > parseFloat(createFeeData.totalFees) && (
                    <p className="text-red-500 text-sm mt-1">Paid amount cannot exceed total fees</p>
                  )}
                </div>

                {/* Payment Mode (if initial payment) */}
                {createFeeData.paidAmount && parseFloat(createFeeData.paidAmount) > 0 && (
                  <>
                    <div className="form-group">
                      <label>Payment Mode</label>
                      <select
                        value={createFeeData.paymentMode}
                        onChange={(e) => setCreateFeeData({...createFeeData, paymentMode: e.target.value})}
                        className="form-select"
                      >
                        <option value="Cash">Cash</option>
                        <option value="Online">Online</option>
                        <option value="Card">Card</option>
                        <option value="UPI">UPI</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Transaction ID (Optional)</label>
                      <input
                        type="text"
                        value={createFeeData.transactionId}
                        onChange={(e) => setCreateFeeData({...createFeeData, transactionId: e.target.value})}
                        className="form-input"
                        placeholder="Enter transaction ID"
                      />
                    </div>
                  </>
                )}

                {/* Remarks */}
                <div className="form-group">
                  <label>Remarks (Optional)</label>
                  <textarea
                    value={createFeeData.remarks}
                    onChange={(e) => setCreateFeeData({...createFeeData, remarks: e.target.value})}
                    className="form-textarea"
                    placeholder="Enter any remarks"
                    rows="3"
                  />
                </div>

                {/* Form Actions */}
                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="submit-btn"
                    disabled={createFeeData.paidAmount && parseFloat(createFeeData.paidAmount) > parseFloat(createFeeData.totalFees)}
                  >
                    Create Fee Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Fee Details - {selectedStudent.name}</h2>
              <button className="close-btn" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Student Info */}
              <div className="student-detail-info">
                <p><strong>Email:</strong> {selectedStudent.email}</p>
                <p><strong>Phone:</strong> {selectedStudent.phone}</p>
              </div>

              {/* Course-wise Fee Breakdown */}
              <h3 className="section-title">Course-wise Fee Breakdown</h3>
              <div className="course-fee-list">
                {getStudentFees(selectedStudent._id).map(fee => (
                  <div key={fee._id} className="course-fee-item">
                    <div className="course-header">
                      <h4>{fee.course?.courseName || 'Course'}</h4>
                      {getStatusBadge(fee.status)}
                    </div>
                    
                    <div className="fee-details">
                      <div className="fee-row">
                        <span>Total Fee:</span>
                        <strong>{formatCurrency(fee.totalFees)}</strong>
                      </div>
                      <div className="fee-row">
                        <span>Paid Amount:</span>
                        <strong className="paid">{formatCurrency(fee.paidAmount)}</strong>
                      </div>
                      <div className="fee-row">
                        <span>Pending Amount:</span>
                        <strong className="pending">{formatCurrency(fee.pendingAmount)}</strong>
                      </div>
                    </div>

                    {/* Payment History */}
                    {fee.payments && fee.payments.length > 0 && (
                      <div className="payment-history">
                        <h5>Payment History</h5>
                        {fee.payments.map((payment, index) => (
                          <div key={index} className="payment-item">
                            <div className="payment-date">
                              {new Date(payment.paymentDate).toLocaleDateString()}
                            </div>
                            <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                            <div className="payment-mode">{payment.paymentMode}</div>
                            {payment.transactionId && (
                              <div className="payment-txn">ID: {payment.transactionId}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Payment Form */}
                    <div className="add-payment-form">
                      <h5>Add Payment</h5>
                      <div className="form-row">
                        <input
                          type="number"
                          placeholder="Amount"
                          value={paymentData.amount}
                          onChange={(e) => setPaymentData({...paymentData, amount: e.target.value})}
                          className="payment-input"
                        />
                        <select
                          value={paymentData.paymentMode}
                          onChange={(e) => setPaymentData({...paymentData, paymentMode: e.target.value})}
                          className="payment-select"
                        >
                          <option value="Cash">Cash</option>
                          <option value="Online">Online</option>
                          <option value="Card">Card</option>
                          <option value="UPI">UPI</option>
                          <option value="Cheque">Cheque</option>
                        </select>
                      </div>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Transaction ID (optional)"
                          value={paymentData.transactionId}
                          onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                          className="payment-input"
                        />
                      </div>
                      <div className="form-row">
                        <input
                          type="text"
                          placeholder="Remarks (optional)"
                          value={paymentData.remarks}
                          onChange={(e) => setPaymentData({...paymentData, remarks: e.target.value})}
                          className="payment-input"
                        />
                      </div>
                      <button 
                        className="add-payment-btn"
                        onClick={() => handleAddPayment(fee._id)}
                      >
                        Add Payment
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeeManagement;
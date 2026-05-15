import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Calendar, 
  Trash2, 
  User, 
  Clock, 
  AlertCircle,
  Loader2
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const SchedulesTable: React.FC = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/admin/schedules`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(res.data);
    } catch (err) {
      setError('Failed to load schedules ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this schedule slot? Any linked meetings will need to be manually managed.')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/admin/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      alert('Failed to delete schedule.');
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="fade-in">
      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '12px', borderRadius: '8px', color: '#EF4444', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Lecturer</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Department</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Date</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Time Slot</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>No active schedules found.</td></tr>
            ) : schedules.map((s) => (
              <tr key={s._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '6px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px' }}>
                      <User size={16} color="#8B5CF6" />
                    </div>
                    <span style={{ fontWeight: '600' }}>{s.lecturerId?.name || 'Unknown'}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-dim)', verticalAlign: 'middle' }}>{s.lecturerId?.department || 'N/A'}</td>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} color="var(--primary)" />
                    <span>{new Date(s.date).toLocaleDateString()}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-dim)' }}>
                    <Clock size={14} />
                    <span>{s.startTime} - {s.endTime}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', verticalAlign: 'middle' }}>
                  <button 
                    onClick={() => handleDelete(s._id)}
                    style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '8px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchedulesTable;

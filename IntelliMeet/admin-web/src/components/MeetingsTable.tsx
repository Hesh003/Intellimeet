import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Video, 
  Trash2, 
  User, 
  BookOpen,
  Calendar,
  Clock,
  Loader2,
  Tag
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const MeetingsTable: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/admin/meetings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(res.data);
    } catch (err) {
      console.error('Failed to load meetings ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('WARNING: Deleting a meeting is permanent. Are you sure?')) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`${API_BASE_URL}/admin/meetings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeetings(prev => prev.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to delete meeting.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10B981';
      case 'cancelled': return '#EF4444';
      case 'completed': return '#3B82F6';
      default: return '#F59E0B';
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
      <Loader2 className="animate-spin" size={40} color="var(--primary)" />
    </div>
  );

  return (
    <div className="fade-in">
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Student</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Lecturer</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Schedule</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {meetings.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>No bookings found in the ledger.</td></tr>
            ) : meetings.map((m) => (
              <tr key={m._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '6px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '6px' }}>
                      <User size={16} color="#3B82F6" />
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{m.studentId?.name || 'Deleted User'}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-dim)' }}>{m.studentId?.idNumber || 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ padding: '6px', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '6px' }}>
                      <BookOpen size={16} color="#8B5CF6" />
                    </div>
                    <div style={{ fontWeight: '500' }}>{m.lecturerId?.name || 'Deleted Lecturer'}</div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ fontSize: '13px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
                      <Calendar size={12} color="var(--primary)" />
                      <span>{m.availabilityId ? new Date(m.availabilityId.date).toLocaleDateString() : 'Slot Deleted'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-dim)' }}>
                      <Clock size={12} />
                      <span>{m.availabilityId?.startTime || 'N/A'} - {m.availabilityId?.endTime || 'N/A'}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: `${getStatusColor(m.status)}15`, 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '11px', 
                    fontWeight: '700',
                    width: 'fit-content',
                    color: getStatusColor(m.status),
                    textTransform: 'uppercase'
                  }}>
                    <Tag size={12} />
                    <span>{m.status}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', verticalAlign: 'middle' }}>
                  <button 
                    onClick={() => handleDelete(m._id)}
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

export default MeetingsTable;

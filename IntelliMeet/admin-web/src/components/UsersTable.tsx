import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  MoreVertical, 
  UserPlus, 
  Shield, 
  BookOpen, 
  User
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || 
                          u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield size={16} color="#F59E0B" />;
      case 'lecturer': return <BookOpen size={16} color="#8B5CF6" />;
      default: return <User size={16} color="#3B82F6" />;
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} color="#555" style={{ position: 'absolute', left: '12px', top: '13px' }} />
            <input 
              type="text" 
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                height: '44px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                paddingLeft: '40px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>
          
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              height: '44px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              color: 'white',
              padding: '0 12px',
              outline: 'none'
            }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="lecturer">Lecturers</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        <button className="primary-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserPlus size={18} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="glass-card" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
            <tr>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>User Name</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Email Address</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Role</th>
              <th style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Created Date</th>
              <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '13px', color: 'var(--text-dim)', fontWeight: '600' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-dim)' }}>No users found matching your search.</td></tr>
            ) : filteredUsers.map((u) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }} className="table-row-hover">
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px' }}>
                      {u.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: '600' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-dim)', fontSize: '14px', verticalAlign: 'middle' }}>{u.email}</td>
                <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: 'rgba(255,255,255,0.03)', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontSize: '12px', 
                    fontWeight: '700',
                    width: 'fit-content',
                    textTransform: 'uppercase'
                  }}>
                    {getRoleIcon(u.role)}
                    <span>{u.role}</span>
                  </div>
                </td>
                <td style={{ padding: '16px 24px', color: 'var(--text-dim)', fontSize: '14px', verticalAlign: 'middle' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 24px', textAlign: 'right', verticalAlign: 'middle' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }}>
                      <Edit2 size={16} />
                    </button>
                    <button style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: '4px' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-hover:hover {
          background: rgba(255,255,255,0.015);
        }
      `}} />
    </div>
  );
};

export default UsersTable;

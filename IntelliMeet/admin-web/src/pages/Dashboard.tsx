import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  Calendar, 
  LayoutDashboard, 
  LogOut, 
  Search, 
  Plus, 
  Trash2, 
  Clock, 
  TrendingUp,
  Filter,
  Video,
  Smartphone
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import UsersTable from '../components/UsersTable';
import SchedulesTable from '../components/SchedulesTable';
import MeetingsTable from '../components/MeetingsTable';
import { QRCodeSVG } from 'qrcode.react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const API_BASE_URL = 'http://localhost:5000/api';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'schedules' | 'meetings'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [networkConfig, setNetworkConfig] = useState<any>(null);

  useEffect(() => {
    fetchStats();
    fetchNetworkConfig();
  }, []);

  const fetchNetworkConfig = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/config`);
      setNetworkConfig(res.data);
    } catch (err) {
      console.log('Failed to fetch network config');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        fill: true,
        label: 'Meeting Activity',
        data: [12, 19, 3, 5, 22, 3, 10],
        borderColor: '#16A34A',
        backgroundColor: 'rgba(22, 197, 94, 0.1)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#050505' }}>
      {/* Sidebar */}
      <div style={{
        width: '260px',
        background: '#0F0F0F',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 8px' }}>
          <div style={{ background: 'var(--primary)', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} color="white" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>IntelliMeet</span>
        </div>

        <nav style={{ flex: 1 }}>
          <NavItem 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
            icon={<LayoutDashboard size={20} />} 
            label="Overview" 
          />
          <NavItem 
            active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')} 
            icon={<Users size={20} />} 
            label="User Management" 
          />
          <NavItem 
            active={activeTab === 'schedules'} 
            onClick={() => setActiveTab('schedules')} 
            icon={<Calendar size={20} />} 
            label="Schedules" 
          />
          <NavItem 
            active={activeTab === 'meetings'} 
            onClick={() => setActiveTab('meetings')} 
            icon={<Video size={20} />} 
            label="Live Meetings" 
          />
        </nav>

        <button 
          onClick={onLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'transparent',
            border: 'none',
            color: '#EF4444',
            padding: '12px',
            borderRadius: '10px',
            fontWeight: '600',
            marginTop: 'auto'
          }}
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>
              {activeTab === 'overview' ? 'System Overview' : 
               activeTab === 'users' ? 'Manage Users' : 
               activeTab === 'schedules' ? 'Faculty Schedules' : 'Meeting Ledger'}
            </h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>Welcome back, System Admin</p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={16} color="var(--primary)" />
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </header>

        {activeTab === 'overview' && (
          <div className="fade-in">
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
              <StatCard label="Total Students" value={stats?.totalStudents || 0} icon={<Users color="#3B82F6" />} color="#3B82F6" />
              <StatCard label="Total Lecturers" value={stats?.totalLecturers || 0} icon={<Users color="#8B5CF6" />} color="#8B5CF6" />
              <StatCard label="Meetings Booked" value={stats?.totalMeetings || 0} icon={<Calendar color="#10B981" />} color="#10B981" />
              <StatCard label="Active Slots" value={stats?.totalAvailabilities || 0} icon={<Clock color="#F59E0B" />} color="#F59E0B" />
            </div>

            {/* Analytics Chart */}
            <div className="glass-card" style={{ padding: '30px' }}>
              <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>Weekly Meeting Activity</h3>
              <div style={{ height: '300px' }}>
                <Line 
                  data={chartData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                      y: { grid: { color: 'rgba(255,255,255,0.05)' }, border: { display: false } },
                      x: { grid: { display: false }, border: { display: false } },
                    }
                  }} 
                />
              </div>
            </div>

            </div>
        )}

        {activeTab === 'users' && <UsersTable />}
        
        {activeTab === 'schedules' && <SchedulesTable />}

        {activeTab === 'meetings' && <MeetingsTable />}
      </div>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      width: '100%',
      padding: '12px 16px',
      borderRadius: '12px',
      background: active ? 'rgba(22, 163, 74, 0.1)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-dim)',
      border: 'none',
      marginBottom: '8px',
      fontWeight: '600',
      transition: 'all 0.2s'
    }}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon, color }: any) => (
  <div className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
    <div style={{ background: `${color}15`, width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <p style={{ fontSize: '12px', color: 'var(--text-dim)', marginBottom: '4px', fontWeight: '600', textTransform: 'uppercase' }}>{label}</p>
      <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{value}</h3>
    </div>
  </div>
);

export default Dashboard;

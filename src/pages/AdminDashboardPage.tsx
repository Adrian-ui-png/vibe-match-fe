import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVibeMatch, API_BASE_URL } from '../context/VibeMatchContext';
import { Shield, Users, DollarSign, ArrowLeft, RefreshCw, CheckCircle, Clock } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useVibeMatch();

  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'logs'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/admin/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchStats(), fetchUsers(), fetchLogs()]);
    setLoading(false);
  };

  useEffect(() => {
    if (!token || !user || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    loadAllData();
  }, [token, user, navigate]);

  const handleUpdateRole = async (userId: string, currentRole: 'admin' | 'user') => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${nextRole}?`)) {
      return;
    }

    setActionLoading(userId);
    try {
      const res = await fetch(`${API_BASE_URL}/admin/user/${userId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: nextRole })
      });

      if (res.ok) {
        await Promise.all([fetchUsers(), fetchLogs()]);
      } else {
        alert("Failed to update user role.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="w-full max-w-sm mx-auto space-y-6 py-4">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors text-xs font-black uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft size={14} /> Profile
        </button>
        <h2 className="text-sm font-black uppercase tracking-wider text-brand-pink flex items-center gap-1.5">
          <Shield size={16} /> Admin Panel
        </h2>
        <button
          onClick={loadAllData}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-6 w-6 border-2 border-brand-pink border-t-transparent rounded-full mx-auto" />
          <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase">Loading admin data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* STATS OVERVIEW CARDS */}
          {stats && (
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-panel p-3.5 rounded-xl border-white/5 flex items-center gap-3">
                <Users size={16} className="text-brand-pink" />
                <div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase block">Users</span>
                  <span className="text-sm font-black text-white">{stats.totalUsers}</span>
                </div>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border-white/5 flex items-center gap-3">
                <DollarSign size={16} className="text-emerald-400" />
                <div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase block">Revenue</span>
                  <span className="text-sm font-black text-white">₹{stats.totalRevenue}</span>
                </div>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border-white/5 flex items-center gap-3">
                <CheckCircle size={16} className="text-emerald-400" />
                <div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase block">Completed</span>
                  <span className="text-xs font-black text-white">{stats.completedTransactions}</span>
                </div>
              </div>
              <div className="glass-panel p-3.5 rounded-xl border-white/5 flex items-center gap-3">
                <Clock size={16} className="text-amber-400" />
                <div>
                  <span className="text-[8px] text-gray-500 font-bold uppercase block">Pending</span>
                  <span className="text-xs font-black text-white">{stats.pendingTransactions}</span>
                </div>
              </div>
            </div>
          )}

          {/* TABS NAVIGATION */}
          <div className="flex bg-[#121626] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'stats' ? 'bg-brand-pink text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Recent Tx
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'users' ? 'bg-brand-pink text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'logs' ? 'bg-brand-pink text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
            >
              Security
            </button>
          </div>

          {/* TAB CONTENT: STATS / TRANSACTION LIST */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Recent Activity</h4>
              <div className="space-y-2">
                {stats.recentTransactions.map((tx: any) => (
                  <div
                    key={tx._id}
                    className="glass-panel p-3 rounded-xl border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white uppercase text-[10px]">
                        {tx.featureType}
                      </span>
                      <span className="text-[8px] text-gray-500 font-bold block uppercase mt-0.5">
                        {tx.razorpayOrderId}
                      </span>
                    </div>
                    <div>
                      {tx.paymentStatus === 'completed' ? (
                        <span className="text-[9px] font-black uppercase text-emerald-400">₹15 Success</span>
                      ) : (
                        <span className="text-[9px] font-black uppercase text-amber-500">Pending</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: USERS LIST */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">User List</h4>
              <div className="space-y-2">
                {users.map((u: any) => (
                  <div
                    key={u._id}
                    className="glass-panel p-3 rounded-xl border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{u.name}</span>
                      <span className="text-[8px] text-gray-400 font-semibold block">{u.email}</span>
                      <span className="inline-flex items-center gap-1 mt-1 bg-white/5 text-gray-300 text-[8px] px-1.5 py-0.5 rounded border border-white/10 font-bold uppercase">
                        {u.role}
                      </span>
                    </div>
                    {u._id !== user.id && (
                      <button
                        onClick={() => handleUpdateRole(u._id, u.role)}
                        disabled={actionLoading === u._id}
                        className="bg-[#121626] hover:bg-brand-pink/10 hover:text-brand-pink text-gray-400 p-2 rounded-lg border border-white/5 text-[9px] font-black uppercase tracking-wider disabled:opacity-50"
                      >
                        Toggle Role
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT: SECURITY LOGS */}
          {activeTab === 'logs' && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">Security Audit Logs (Last 100)</h4>
              <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {logs.map((log: any) => (
                  <div
                    key={log._id}
                    className="glass-panel p-3 rounded-xl border-white/5 space-y-1 text-left text-[10px]"
                  >
                    <div className="flex justify-between items-center text-gray-400 font-bold uppercase text-[8px]">
                      <span>{log.action}</span>
                      <span>{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                    </div>
                    <p className="text-white font-semibold leading-tight break-all">
                      Actor: <span className="text-brand-pink font-bold">{log.actorEmail}</span>
                    </p>
                    <div className="flex justify-between text-[8px] text-gray-500 font-bold uppercase pt-0.5 border-t border-white/5">
                      <span>IP: {log.ipAddress}</span>
                      <span>OS/Agent: {log.userAgent.substring(0, 15)}...</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

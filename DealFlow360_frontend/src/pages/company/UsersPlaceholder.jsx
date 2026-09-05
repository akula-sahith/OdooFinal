import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import {
  UserCheck,
  Search,
  Plus,
  X,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

export const UsersPlaceholder = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'Salesperson',
    department: 'Sales Operations',
  });

  // Load from LocalStorage (ZERO PRE-SEEDED DUMMY USERS)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('dealflow360_users');
      if (saved) {
        setUsers(JSON.parse(saved));
      } else {
        setUsers([]);
      }
    } catch (e) {
      setUsers([]);
    }
  }, []);

  const saveUsers = (newList) => {
    setUsers(newList);
    try {
      localStorage.setItem('dealflow360_users', JSON.stringify(newList));
    } catch (e) {
      // ignore
    }
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) return;

    const newUser = {
      id: `usr_${Date.now().toString().slice(-4)}`,
      fullName: formData.fullName,
      email: formData.email,
      role: formData.role,
      department: formData.department,
      status: 'Active',
    };

    saveUsers([...users, newUser]);
    setIsModalOpen(false);
    setFormData({ fullName: '', email: '', role: 'Salesperson', department: 'Sales Operations' });
  };

  const handleDelete = (id) => {
    saveUsers(users.filter((u) => u.id !== id));
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Staff Personnel Management"
        subtitle="Manage company staff profiles, department assignments, and security roles."
        badgeText={`${users.length} Active Staff`}
        badgeVariant="plum"
      />

      {/* Unified Enterprise Container */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden space-y-4 p-6">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, email, role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="h-9 px-4 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 text-white" /> Invite Staff Member
          </button>
        </div>

        {/* Data Table or Zero State */}
        {filteredUsers.length > 0 ? (
          <div className="rounded-xl border border-slate-200/80 overflow-hidden pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Staff Member</th>
                    <th className="py-3 px-4">Email Address</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[#F7F2F5] text-[#714B67] font-bold text-xs flex items-center justify-center border border-[#714B67]/20">
                          {u.fullName.charAt(0)}
                        </div>
                        <span>{u.fullName}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{u.email}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-medium">{u.department}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#714B67] bg-[#F7F2F5] px-2 py-0.5 rounded-full border border-[#714B67]/30">
                          <CheckCircle2 className="w-3 h-3 text-[#714B67]" /> Active
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(u.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Clean Zero State Shell */
          <div className="py-16 text-center space-y-4 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <div className="w-12 h-12 bg-[#F7F2F5] text-[#714B67] rounded-2xl flex items-center justify-center mx-auto border border-[#714B67]/20">
              <UserCheck className="w-6 h-6 text-[#714B67]" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-extrabold text-slate-900">No Staff Members Registered</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Invite team managers and salespeople to delegate workspace roles.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" /> Invite Staff Member
            </button>
          </div>
        )}
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#714B67]" /> Invite Staff Member
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="alex@dealflow360.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Assign Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full h-10 px-3 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                >
                  <option value="Salesperson">Salesperson</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

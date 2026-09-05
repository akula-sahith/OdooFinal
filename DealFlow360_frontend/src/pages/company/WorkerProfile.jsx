import React from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAuth } from '../../hooks/auth/useAuth';
import { usePermissions } from '../../hooks/auth/usePermissions';
import {
  User,
  Mail,
  Shield,
  Briefcase,
  Lock,
  Building,
  Key,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const WorkerProfile = () => {
  const { user, role } = useAuth();
  const { permissions } = usePermissions();

  const employeeId = user?.employeeId || 'DF360-EMP-9042';
  const department = user?.department || (role === 'Admin' ? 'Executive & Operations' : role === 'Sales Manager' ? 'Sales Operations' : 'B2B Sales');
  const assignedWorkspace = 'North America Regional Hub';
  const mfaStatus = 'Active (Authenticator App)';
  const lastActive = 'Today at 14:42 IST';

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Worker & Staff Profile"
        subtitle="Official employee record, role details, security credentials, and authorized workspace permissions."
        badgeText={`Employee ID: ${employeeId}`}
        badgeVariant="plum"
      />

      {/* Non-Editable Security Notice */}
      <div className="p-4 bg-[#F7F2F5] border border-[#714B67]/30 rounded-2xl flex items-start gap-3 text-[#714B67] shadow-2xs">
        <Lock className="w-5 h-5 text-[#714B67] shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-[#714B67]">🔒 Profile Security Policy (Non-Editable)</p>
          <p className="text-slate-700 font-medium leading-relaxed">
            Worker profile identity, department assignments, and permission parameters are managed exclusively by HR & System Administrators. 
            To request updates to your title, email, or role access, please submit a ticket to security administration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Header */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs text-center space-y-4">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-[#714B67] text-white font-extrabold text-3xl flex items-center justify-center mx-auto shadow-md border-4 border-white">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
              <div className="absolute bottom-0 right-0 p-1.5 bg-[#714B67] text-white rounded-full border-2 border-white shadow-xs" title="Account Active">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-slate-900">{user?.fullName || 'Rahul Kumar'}</h2>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">{user?.email || 'rahul@dealflow360.com'}</p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F7F2F5] text-[#714B67] border border-[#714B67]/30">
                {role || 'Company Staff'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Active Staff
              </span>
            </div>

            <hr className="border-slate-100 my-4" />

            <div className="text-left space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400" /> Department
                </span>
                <span className="font-bold text-slate-900">{department}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" /> Workspace
                </span>
                <span className="font-bold text-slate-900">{assignedWorkspace}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-semibold flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Last Active
                </span>
                <span className="font-bold text-slate-900">{lastActive}</span>
              </div>
            </div>
          </div>

          {/* MFA & Security Status */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#714B67]" /> Security Status
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">MFA Verification</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-[#F7F2F5] text-[#714B67] rounded-full border border-[#714B67]/30">
                  ENABLED
                </span>
              </div>
              <p className="text-[11px] text-slate-500">{mfaStatus}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-700">Session IP</span>
                <span className="text-[11px] font-mono text-slate-600">192.168.1.42</span>
              </div>
              <p className="text-[11px] text-slate-500">TLS 1.3 Encrypted Session</p>
            </div>
          </div>
        </div>

        {/* Profile Details & Permissions Grid */}
        <div className="lg:col-span-2 space-y-6">
          {/* Read-Only Details Form */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-[#714B67]" /> Employee Personnel Record
              </h3>
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Read-Only Mode
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Full Legal Name</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={user?.fullName || 'Rahul Kumar'}
                    className="w-full h-10 px-3 py-2 text-xs font-medium text-slate-800 bg-slate-100/80 border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Work Email Address</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={user?.email || 'rahul@dealflow360.com'}
                    className="w-full h-10 px-3 py-2 text-xs font-medium text-slate-800 bg-slate-100/80 border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">System Employee ID</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={employeeId}
                    className="w-full h-10 px-3 py-2 text-xs font-medium font-mono text-slate-800 bg-slate-100/80 border border-slate-200 rounded-xl cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Assigned Role</label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    disabled
                    value={role || 'Company Staff'}
                    className="w-full h-10 px-3 py-2 text-xs font-bold text-[#714B67] bg-[#F7F2F5] border border-[#714B67]/20 rounded-xl cursor-not-allowed"
                  />
                  <Lock className="w-3.5 h-3.5 text-[#714B67] absolute right-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Department</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={department}
                  className="w-full h-10 px-3 py-2 text-xs font-medium text-slate-800 bg-slate-100/80 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Clearance Level</label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={role === 'Admin' ? 'Level 4 - Full System Access' : role === 'Sales Manager' ? 'Level 3 - Managerial Access' : 'Level 2 - Regional B2B Access'}
                  className="w-full h-10 px-3 py-2 text-xs font-medium text-slate-800 bg-slate-100/80 border border-slate-200 rounded-xl cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Assigned System Permissions List */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Key className="w-4 h-4 text-[#714B67]" /> Authorized RBAC Permissions
              </h3>
              <span className="text-xs font-bold text-[#714B67] bg-[#F7F2F5] px-2.5 py-1 rounded-full border border-[#714B67]/20">
                {permissions.includes('*') ? 'All Permissions (*)' : `${permissions.length} Granted Permissions`}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Operational capabilities granted to your profile based on active security roles:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-2">
              {permissions.map((perm) => (
                <div
                  key={perm}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs font-semibold text-slate-700"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#714B67] shrink-0" />
                  <span className="truncate font-mono text-[11px]">{perm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

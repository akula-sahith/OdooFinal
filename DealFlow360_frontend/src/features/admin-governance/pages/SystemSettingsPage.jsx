/**
 * SystemSettingsPage Component
 * Admin Typed Platform Configuration Settings at /company/admin/settings
 */

import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Sliders, Save, Check, AlertCircle } from 'lucide-react';
import { adminGovernanceService } from '../services/adminGovernanceService';

export function SystemSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [savedMsg, setSavedMsg] = useState('');
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminGovernanceService.getSystemSettings();
      setSettings(data);
    } catch (e) {
      setError('Failed to load system settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleChangeValue = (key, val, type) => {
    setSettings((prev) =>
      prev.map((s) => {
        if (s.key !== key) return s;
        let typedVal = val;
        if (type === 'NUMBER') typedVal = Number(val);
        if (type === 'BOOLEAN') typedVal = val === 'true' || val === true;
        return { ...s, value: typedVal };
      })
    );
  };

  const handleSaveAll = async () => {
    // Validation
    for (const s of settings) {
      if (s.type === 'NUMBER' && (isNaN(s.value) || s.value < 0)) {
        alert(`Validation error for setting "${s.key}": Value must be a non-negative number.`);
        return;
      }
    }

    setSaving(true);
    try {
      await adminGovernanceService.updateSystemSettings(settings);
      setSavedMsg('System settings successfully validated and saved.');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (e) {
      alert('Failed to save system settings.');
    } finally {
      setSaving(false);
    }
  };

  const adminNavTabs = [
    { label: 'Overview', to: '/company/admin', end: true },
    { label: 'Staff Users', to: '/company/admin/users' },
    { label: 'Roles & Matrix', to: '/company/admin/roles' },
    { label: 'Approval Rules', to: '/company/admin/approval-rules' },
    { label: 'Warehouses', to: '/company/admin/warehouses' },
    { label: 'Tax Configuration', to: '/company/admin/taxes' },
    { label: 'Currencies', to: '/company/admin/currencies' },
    { label: 'System Settings', to: '/company/admin/settings' },
    { label: 'Audit Logs', to: '/company/admin/audit-logs' },
    { label: 'Security Center', to: '/company/admin/security' },
  ];

  return (
    <div className="space-y-6 md:space-y-8 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Sliders className="w-7 h-7 text-amber-400" />
            Centralized Platform System Settings
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Typed configuration parameters governing Quotations, Orders, Finance, Security, and Notifications.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition self-start sm:self-auto disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-2">
        {adminNavTabs.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `px-3.5 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      {savedMsg && (
        <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="p-4 bg-rose-950/40 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={loadSettings} className="px-3 py-1 bg-rose-800 text-white rounded font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Settings Table */}
      <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl space-y-4 text-xs">
        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.key}
              className="p-4 bg-slate-800/50 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 md:w-1/2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{setting.key}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-amber-400 border border-slate-700 font-bold">
                    {setting.type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-400 border border-slate-700">
                    {setting.scope}
                  </span>
                </div>
                <p className="text-slate-400 text-xs">{setting.description}</p>
              </div>

              {/* Typed Input Controls */}
              <div className="md:w-1/3">
                {setting.type === 'BOOLEAN' ? (
                  <select
                    value={String(setting.value)}
                    onChange={(e) => handleChangeValue(setting.key, e.target.value, setting.type)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold"
                  >
                    <option value="true">ENABLED (true)</option>
                    <option value="false">DISABLED (false)</option>
                  </select>
                ) : setting.type === 'NUMBER' ? (
                  <input
                    type="number"
                    value={setting.value}
                    onChange={(e) => handleChangeValue(setting.key, e.target.value, setting.type)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                ) : (
                  <input
                    type="text"
                    value={setting.value}
                    onChange={(e) => handleChangeValue(setting.key, e.target.value, setting.type)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-semibold"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SystemSettingsPage;

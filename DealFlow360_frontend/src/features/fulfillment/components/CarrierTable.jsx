/**
 * Carrier Management Data Table Component
 * Phase 13 — DealFlow360
 */

import React from 'react';
import { Truck, Edit3, Power, ExternalLink, Search } from 'lucide-react';

export const CarrierTable = ({
  carriers = [],
  loading = false,
  onEdit,
  onToggleStatus,
  onSearchChange,
  searchValue = '',
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-2xs">
        <div className="w-8 h-8 border-4 border-[#714B67] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500 mt-2">Loading shipping carriers...</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden flex flex-col space-y-4 p-4">
      {/* Top Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search carrier by name or code..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full h-10 pl-9 pr-4 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none transition-all"
        />
      </div>

      <div className="overflow-x-auto border border-slate-200/80 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Carrier Name</th>
              <th className="py-3.5 px-4">Carrier Code</th>
              <th className="py-3.5 px-4">Tracking Template URL</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {carriers.map((carrier) => (
              <tr key={carrier.carrierId} className="hover:bg-slate-50/80 transition-colors">
                {/* Name */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-[#F7F2F5] text-[#714B67] rounded-lg">
                      <Truck className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-slate-900">{carrier.name}</span>
                  </div>
                </td>

                {/* Code */}
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                  {carrier.carrierCode}
                </td>

                {/* Tracking URL */}
                <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate font-mono text-[11px]">
                  {carrier.trackingUrlTemplate ? (
                    <span title={carrier.trackingUrlTemplate}>{carrier.trackingUrlTemplate}</span>
                  ) : (
                    <span className="italic text-slate-400">Direct Fleet Dispatch</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                      carrier.status === 'ACTIVE'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        carrier.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    ></span>
                    {carrier.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(carrier.carrierId, carrier.status)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 cursor-pointer ${
                        carrier.status === 'ACTIVE'
                          ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100'
                          : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      title={carrier.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    >
                      <Power className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onEdit(carrier)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                      title="Edit Carrier Configuration"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

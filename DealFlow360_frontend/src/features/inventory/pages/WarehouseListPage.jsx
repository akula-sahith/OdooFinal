import React, { useState } from 'react';
import { Building2, Plus, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useWarehouses } from '../hooks/useWarehouses';
import { warehouseService } from '../services/warehouseService';
import { WarehouseFilters } from '../components/WarehouseFilters';
import { WarehouseTable } from '../components/WarehouseTable';
import { WarehouseFormModal } from '../components/WarehouseFormModal';

export const WarehouseListPage = () => {
  const navigate = useNavigate();
  const { warehouses, meta, loading, error, filters, updateFilters, setPage, refetch } = useWarehouses();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState(null);

  const handleCreateWarehouse = async (data) => {
    setSubmitting(true);
    setModalError(null);
    try {
      await warehouseService.createWarehouse(data);
      setShowCreateModal(false);
      await refetch();
    } catch (err) {
      setModalError(err.message || 'Failed to create warehouse.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, newStatus) => {
    try {
      await warehouseService.updateWarehouseStatus(id, newStatus);
      await refetch();
    } catch (err) {
      // Handled
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div className="space-y-1">
          <Link to="/company/inventory" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory Control Center</span>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary-500" />
            <span>Warehouse Fulfillment Hubs</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Manage physical warehouse facilities, locations, addresses, and operational status.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Warehouse</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Filters */}
      <WarehouseFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={() => updateFilters({ search: '', status: 'ALL', page: 1 })}
        loading={loading}
      />

      {/* Table */}
      <WarehouseTable warehouses={warehouses} loading={loading} onToggleStatus={handleToggleStatus} />

      {/* Create Modal */}
      <WarehouseFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateWarehouse}
        submitting={submitting}
        error={modalError}
      />
    </div>
  );
};

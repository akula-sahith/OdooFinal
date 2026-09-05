/**
 * Shipping Carrier Management & Configuration Page
 * Route: /company/fulfillment/carriers
 * Phase 13 — DealFlow360
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../../../components/ui/PageHeader';
import { Plus, ArrowLeft, ShieldAlert } from 'lucide-react';
import { useCarriers } from '../hooks/useCarriers';
import { CarrierTable } from '../components/CarrierTable';
import { CarrierFormModal } from '../components/CarrierFormModal';

export const CarrierListPage = () => {
  const navigate = useNavigate();
  const {
    carriers,
    loading,
    params,
    updateFilters,
    createCarrier,
    updateCarrier,
    toggleCarrierStatus,
  } = useCarriers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [error, setError] = useState(null);

  const handleOpenCreate = () => {
    setSelectedCarrier(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (carrier) => {
    setSelectedCarrier(carrier);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setError(null);
      if (selectedCarrier) {
        await updateCarrier(selectedCarrier.carrierId, formData);
      } else {
        await createCarrier(formData);
      }
      setIsModalOpen(false);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setError(null);
      await toggleCarrierStatus(id, currentStatus);
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/company/fulfillment')}
          className="p-2 text-slate-500 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <PageHeader
          title="Shipping Carrier Management"
          subtitle="Configure shipping carrier integrations, tracking template URLs, and logistics providers."
          badgeText={`${carriers.length} Registered Carriers`}
          badgeVariant="plum"
        >
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-[#714B67] hover:bg-[#56384E] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" /> Register New Carrier
          </button>
        </PageHeader>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-800 text-xs font-semibold">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <CarrierTable
        carriers={carriers}
        loading={loading}
        onEdit={handleOpenEdit}
        onToggleStatus={handleToggleStatus}
        searchValue={params.search || ''}
        onSearchChange={(search) => updateFilters({ search })}
      />

      <CarrierFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        carrier={selectedCarrier}
        onSubmitCarrier={handleFormSubmit}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { Package, Plus, Sliders, ArrowRightLeft, RefreshCw } from 'lucide-react';
import { useInventory } from '../hooks/useInventory';
import { useWarehouses } from '../hooks/useWarehouses';
import { InventoryFilters } from '../components/InventoryFilters';
import { InventoryStockTable } from '../components/InventoryStockTable';
import { StockAdjustmentModal } from '../components/StockAdjustmentModal';
import { StockTransferModal } from '../components/StockTransferModal';

export const InventoryStockPage = () => {
  const {
    stockRecords,
    meta,
    loading,
    adjusting,
    error,
    filters,
    updateFilters,
    setPage,
    adjustStock,
    transferStock,
    refetch,
  } = useInventory();

  const { warehouses } = useWarehouses();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [modalError, setModalError] = useState(null);

  const handleOpenAdjust = (record) => {
    setSelectedRecord(record);
    setShowAdjustModal(true);
    setModalError(null);
  };

  const handleOpenTransfer = (record) => {
    setSelectedRecord(record);
    setShowTransferModal(true);
    setModalError(null);
  };

  const handleConfirmAdjust = async (data) => {
    try {
      await adjustStock(data);
      setShowAdjustModal(false);
    } catch (err) {
      setModalError(err.message || 'Failed to adjust stock.');
    }
  };

  const handleConfirmTransfer = async (data) => {
    try {
      await transferStock(data);
      setShowTransferModal(false);
    } catch (err) {
      setModalError(err.message || 'Failed to execute stock transfer.');
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Master Stock Catalog
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time physical stock levels, order reservations, available quantities, and warehouse adjustments.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          disabled={loading}
          className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 rounded-xl shadow-2xs transition flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 rounded-xl">
          {error}
        </div>
      )}

      {/* Filters */}
      <InventoryFilters
        filters={filters}
        onFilterChange={updateFilters}
        onReset={() => updateFilters({ search: '', warehouseId: 'ALL', status: 'ALL', page: 1 })}
        warehouses={warehouses}
        loading={loading}
      />

      {/* Stock Table */}
      <InventoryStockTable
        stockRecords={stockRecords}
        loading={loading}
        onOpenAdjust={handleOpenAdjust}
        onOpenTransfer={handleOpenTransfer}
      />

      {/* Modals */}
      <StockAdjustmentModal
        isOpen={showAdjustModal}
        onClose={() => setShowAdjustModal(false)}
        onConfirm={handleConfirmAdjust}
        stockRecord={selectedRecord}
        submitting={adjusting}
        error={modalError}
      />

      <StockTransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onConfirm={handleConfirmTransfer}
        stockRecord={selectedRecord}
        warehouses={warehouses}
        submitting={adjusting}
        error={modalError}
      />
    </div>
  );
};

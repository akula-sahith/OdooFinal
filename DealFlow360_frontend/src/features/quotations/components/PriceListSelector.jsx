import React, { useState } from 'react';
import { Tag, Calendar, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card/Card';
import { Select } from '../../../components/ui/Select/Select';
import { StatusBadge } from '../../../components/ui/StatusBadge/StatusBadge';
import { ConfirmationDialog } from '../../../components/dialogs/ConfirmationDialog/ConfirmationDialog';

/**
 * PriceListSelector Component
 * Allows salespeople to choose active price lists while enforcing currency locks
 * and price change confirmation warnings.
 */
export const PriceListSelector = ({
  priceLists = [],
  selectedPriceListId = '',
  onSelectPriceList,
  hasItems = false,
  disabled = false,
}) => {
  const [pendingPriceListId, setPendingPriceListId] = useState(null);
  const [isWarningOpen, setIsWarningOpen] = useState(false);

  const selectedList = priceLists.find(
    (pl) => pl.id === selectedPriceListId || pl.priceListId === selectedPriceListId
  );

  const handleSelectChange = (e) => {
    const newId = e.target.value;
    if (newId === selectedPriceListId) return;

    if (hasItems) {
      setPendingPriceListId(newId);
      setIsWarningOpen(true);
    } else {
      onSelectPriceList(newId);
    }
  };

  const handleConfirmChange = () => {
    if (pendingPriceListId) {
      onSelectPriceList(pendingPriceListId);
    }
    setIsWarningOpen(false);
    setPendingPriceListId(null);
  };

  const handleCancelChange = () => {
    setIsWarningOpen(false);
    setPendingPriceListId(null);
  };

  const options = priceLists.map((pl) => {
    const id = pl.id || pl.priceListId;
    const code = pl.code || id;
    const currency = pl.currency || 'INR';
    return {
      value: id,
      label: `${pl.name} (${code}) — ${currency}`,
    };
  });

  return (
    <Card className="p-5 border border-slate-200 bg-white shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#714B67]/10 text-[#714B67]">
            <Tag size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Commercial Price List</h3>
            <p className="text-xs text-slate-500">Base unit pricing and currency authority</p>
          </div>
        </div>

        {selectedList && (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-50 text-[#714B67] border border-[#714B67]/20">
              Currency Locked: {selectedList.currency || 'INR'}
            </span>
            <StatusBadge status={selectedList.status || 'ACTIVE'} size="sm" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Select Price List <span className="text-rose-500">*</span>
          </label>
          <Select
            value={selectedPriceListId}
            onChange={handleSelectChange}
            disabled={disabled || priceLists.length === 0}
            options={options}
            className="w-full"
          />
        </div>

        {selectedList && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Code:</span>
              <span className="font-mono text-slate-900">{selectedList.code || selectedList.id}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium text-slate-700">Effective Period:</span>
              <span className="flex items-center gap-1 text-slate-800">
                <Calendar size={12} className="text-slate-400" />
                {selectedList.effectiveFrom || '2026-01-01'} — {selectedList.effectiveTo || '2026-12-31'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Warning Modal when changing Price List with active items */}
      <ConfirmationDialog
        isOpen={isWarningOpen}
        onClose={handleCancelChange}
        onConfirm={handleConfirmChange}
        title="Change Price List?"
        message="Changing the price list will reload and revalidate the unit base prices of all existing line items against the new price list. Continue?"
        confirmText="Change & Revalidate Prices"
        cancelText="Keep Current Price List"
        variant="warning"
        icon={<AlertTriangle className="text-amber-500" size={24} />}
      />
    </Card>
  );
};

/**
 * Shipment Creation & Carrier Manifest Generation Modal Component
 * Snapshots Shipping Address & Assigns Tracking Info
 * Phase 13 — DealFlow360
 */

import React, { useState, useEffect } from 'react';
import { X, Truck, ShieldAlert, Check, MapPin, Barcode } from 'lucide-react';
import { carrierService } from '../services/carrierService';
import { validateShippingAddressSnapshot } from '../validation/fulfillmentValidation';

export const ShipmentCreationModal = ({ isOpen, onClose, fulfillment, onSubmitShipment }) => {
  const [carriers, setCarriers] = useState([]);
  const [selectedCarrierId, setSelectedCarrierId] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [estimatedDeliveryAt, setEstimatedDeliveryAt] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [address, setAddress] = useState({
    recipientName: '',
    companyName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'USA',
    postalCode: '',
    phone: '',
  });

  const [error, setError] = useState(null);
  const [loadingCarriers, setLoadingCarriers] = useState(true);

  useEffect(() => {
    if (fulfillment) {
      setAddress({
        recipientName: fulfillment.shippingAddress?.recipientName || fulfillment.customerName || '',
        companyName: fulfillment.shippingAddress?.companyName || fulfillment.customerName || '',
        addressLine1: fulfillment.shippingAddress?.addressLine1 || '742 Industrial Way',
        addressLine2: fulfillment.shippingAddress?.addressLine2 || '',
        city: fulfillment.shippingAddress?.city || 'Chicago',
        state: fulfillment.shippingAddress?.state || 'IL',
        country: fulfillment.shippingAddress?.country || 'USA',
        postalCode: fulfillment.shippingAddress?.postalCode || '60607',
        phone: fulfillment.shippingAddress?.phone || '+1 (312) 555-0199',
      });
      setTrackingNumber(`FX-TRK-${Math.floor(10000000 + Math.random() * 90000000)}`);
    }
  }, [fulfillment]);

  useEffect(() => {
    const loadCarriers = async () => {
      setLoadingCarriers(true);
      try {
        const list = await carrierService.getCarriers({ status: 'ACTIVE' });
        setCarriers(list);
        if (list.length > 0) setSelectedCarrierId(list[0].carrierId);
      } catch (e) {
        console.error('Failed loading carriers', e);
      } finally {
        setLoadingCarriers(false);
      }
    };
    if (isOpen) loadCarriers();
  }, [isOpen]);

  if (!isOpen || !fulfillment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const addrCheck = validateShippingAddressSnapshot(address);
    if (!addrCheck.isValid) {
      setError(addrCheck.errors.join(' '));
      return;
    }

    const carrier = carriers.find((c) => c.carrierId === selectedCarrierId) || {
      carrierId: 'CAR-001',
      carrierCode: 'FEDEX',
      name: 'FedEx Express',
    };

    onSubmitShipment({
      carrierId: carrier.carrierId,
      carrierCode: carrier.carrierCode,
      carrierName: carrier.name,
      trackingNumber,
      estimatedDeliveryAt: new Date(estimatedDeliveryAt).toISOString(),
      shippingAddress: address, // Address snapshot
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-extrabold text-slate-900">
              Create Shipment & Manifest — {fulfillment.fulfillmentId}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Carrier */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Logistics Shipping Carrier *
              </label>
              <select
                required
                value={selectedCarrierId}
                onChange={(e) => setSelectedCarrierId(e.target.value)}
                className="w-full h-10 px-3 text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none cursor-pointer"
              >
                {carriers.map((c) => (
                  <option key={c.carrierId} value={c.carrierId}>
                    {c.name} ({c.carrierCode})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tracking Number *
              </label>
              <div className="relative">
                <Barcode className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Estimated Delivery Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Estimated Delivery Date
            </label>
            <input
              type="date"
              required
              value={estimatedDeliveryAt}
              onChange={(e) => setEstimatedDeliveryAt(e.target.value)}
              className="w-full h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#714B67] outline-none"
            />
          </div>

          {/* Shipping Address Snapshot Fields */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> Immutable Shipping Address Snapshot
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Recipient Name *
                </label>
                <input
                  type="text"
                  required
                  value={address.recipientName}
                  onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Company Name
                </label>
                <input
                  type="text"
                  value={address.companyName}
                  onChange={(e) => setAddress({ ...address, companyName: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                Address Line 1 *
              </label>
              <input
                type="text"
                required
                value={address.addressLine1}
                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                className="w-full h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">City *</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">State</label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                  Postal Code *
                </label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  className="w-full h-8 px-2.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg outline-none"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" /> Create Shipment Manifest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

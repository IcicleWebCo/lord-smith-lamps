import React, { useState, useEffect } from 'react';
import { X, Truck } from 'lucide-react';

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (trackingNumber: string) => void;
  orderIdShort: string;
}

const TrackingModal: React.FC<TrackingModalProps> = ({ isOpen, onClose, onSubmit, orderIdShort }) => {
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTrackingNumber('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(trackingNumber);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-walnut-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-walnut-900 border border-walnut-800 rounded-lg w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-walnut-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-forge-600/20 rounded-lg">
              <Truck className="h-5 w-5 text-forge-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-parchment-50 font-display">Mark as Shipped</h2>
              <p className="text-xs text-parchment-400 mt-0.5">Order #{orderIdShort}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-walnut-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-parchment-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="trackingNumber" className="block text-sm font-medium text-parchment-200 mb-2">
              Tracking Number <span className="text-parchment-500 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="trackingNumber"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter tracking number"
              className="w-full px-4 py-2.5 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-50 placeholder-parchment-500 focus:outline-none focus:ring-2 focus:ring-forge-500 focus:border-transparent transition-all"
              autoFocus
            />
            <p className="text-xs text-parchment-500 mt-2">
              You can leave this blank and add it later if needed.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-walnut-800 text-parchment-300 rounded-lg hover:bg-walnut-700 border border-walnut-700 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-forge-600 text-parchment-50 rounded-lg hover:bg-forge-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Mark as Shipped
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrackingModal;

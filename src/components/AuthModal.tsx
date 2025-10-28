import React from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSignIn }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-soot-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-walnut-900 rounded-xl shadow-forge max-w-md w-full p-8 border border-walnut-700">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-parchment-400 hover:text-parchment-200 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-parchment-50 mb-2 font-display">
            Authentication Required
          </h2>
          <p className="text-parchment-300">
            Please sign in or create an account to proceed with checkout
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={onSignIn}
            className="w-full flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge"
          >
            <LogIn className="h-5 w-5" />
            Sign In
          </button>

          <button
            onClick={onClose}
            className="w-full py-3 text-parchment-400 hover:text-parchment-200 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

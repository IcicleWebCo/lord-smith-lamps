import React from 'react';
import { User, Mail, Calendar, Shield } from 'lucide-react';

interface AccountSettingsProps {
  user: {
    id: string;
    email: string;
    name: string;
    created_at?: string;
  };
  isAdmin: boolean;
  onNavigateToAdmin: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, isAdmin, onNavigateToAdmin }) => {
  const getMembershipDuration = () => {
    if (!user.created_at) return 'New member';

    const createdDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} ${diffDays === 1 ? 'day' : 'days'}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} ${months === 1 ? 'month' : 'months'}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} ${years === 1 ? 'year' : 'years'}`;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-walnut-800 rounded-xl p-6 border-2 border-walnut-700">
        <h3 className="text-xl font-bold text-parchment-50 mb-6 font-display flex items-center gap-2">
          <User className="h-5 w-5 text-ember-400" />
          Account Information
        </h3>

        <div className="space-y-5">
          <div className="group">
            <label className="block text-sm font-medium text-parchment-400 mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </label>
            <div className="bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-3 group-hover:border-walnut-600 transition-colors">
              <p className="text-parchment-50 font-medium">{user.name}</p>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-parchment-400 mb-2 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <div className="bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-3 group-hover:border-walnut-600 transition-colors">
              <p className="text-parchment-50 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-parchment-400 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Member Since
            </label>
            <div className="bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-3 group-hover:border-walnut-600 transition-colors">
              <p className="text-parchment-50 font-medium">{getMembershipDuration()}</p>
            </div>
          </div>
        </div>
      </div>

      {isAdmin && (
        <div className="bg-gradient-to-br from-gold-900 to-gold-950 rounded-xl p-6 border-2 border-gold-700">
          <div className="flex items-start gap-4">
            <div className="bg-gold-800 p-3 rounded-lg">
              <Shield className="h-6 w-6 text-gold-400" />
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-parchment-50 mb-2 font-display">
                Administrator Access
              </h4>
              <p className="text-parchment-300 text-sm mb-4">
                You have elevated privileges to manage products, orders, and site content.
              </p>
              <button
                onClick={onNavigateToAdmin}
                className="px-6 py-2.5 bg-gradient-to-r from-gold-600 to-gold-500 text-parchment-50 rounded-lg font-semibold hover:from-gold-700 hover:to-gold-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Shield className="h-4 w-4" />
                Go to Admin Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;

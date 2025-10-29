import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, XCircle, Search, Trash2, Calendar, Copy, Check } from 'lucide-react';
import { getSubscriptions, updateSubscription, deleteSubscription, NewsletterSubscription } from '../../lib/admin';

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showEmailList, setShowEmailList] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    const data = await getSubscriptions();
    setSubscriptions(data);
    setLoading(false);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateSubscription(id, { is_active: !currentStatus });
      await loadSubscriptions();
    } catch (error) {
      console.error('Error toggling subscription status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;

    try {
      await deleteSubscription(id);
      await loadSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filter === 'all' ||
      (filter === 'active' && sub.is_active) ||
      (filter === 'inactive' && !sub.is_active);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEmailList = () => {
    return filteredSubscriptions
      .filter(sub => sub.is_active)
      .map(sub => sub.email)
      .join(', ');
  };

  const handleCopyEmails = async () => {
    const emailList = getEmailList();
    try {
      await navigator.clipboard.writeText(emailList);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy emails:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-parchment-300">Loading subscriptions...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-parchment-50 font-display">Newsletter Subscriptions</h1>
          <p className="text-parchment-300 mt-2">Manage your email subscribers</p>
        </div>
        <button
          onClick={() => setShowEmailList(!showEmailList)}
          className="px-4 py-2 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge flex items-center gap-2"
        >
          <Mail className="h-4 w-4" />
          {showEmailList ? 'Hide' : 'View'} Email List
        </button>
      </div>

      {showEmailList && (
        <div className="bg-walnut-900 border-2 border-forge-600 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-parchment-50 font-display flex items-center gap-2">
                <Mail className="h-5 w-5 text-ember-400" />
                Active Email Addresses
              </h3>
              <p className="text-parchment-400 text-sm mt-1">
                {filteredSubscriptions.filter(sub => sub.is_active).length} active subscribers
              </p>
            </div>
            <button
              onClick={handleCopyEmails}
              className="px-4 py-2 bg-forge-600 text-parchment-50 rounded-lg font-semibold hover:bg-forge-700 transition-all duration-300 flex items-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>
          <div className="bg-walnut-800 border border-walnut-700 rounded-lg p-4 max-h-48 overflow-y-auto">
            <p className="text-parchment-200 text-sm font-mono break-all leading-relaxed">
              {getEmailList() || 'No active subscribers'}
            </p>
          </div>
        </div>
      )}

      <div className="bg-walnut-900 border border-walnut-800 rounded-lg p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-parchment-400" />
            <input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-walnut-800 border border-walnut-700 rounded-lg text-parchment-100 placeholder-parchment-400 focus:outline-none focus:ring-2 focus:ring-forge-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all'
                  ? 'bg-forge-600 text-parchment-50'
                  : 'bg-walnut-800 text-parchment-300 hover:bg-walnut-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'active'
                  ? 'bg-patina-600 text-parchment-50'
                  : 'bg-walnut-800 text-parchment-300 hover:bg-walnut-700'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'inactive'
                  ? 'bg-mahogany-600 text-parchment-50'
                  : 'bg-walnut-800 text-parchment-300 hover:bg-walnut-700'
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </div>

      <div className="bg-walnut-900 border border-walnut-800 rounded-lg overflow-hidden">
        {filteredSubscriptions.length === 0 ? (
          <div className="p-8 text-center text-parchment-400">
            <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No subscriptions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-walnut-800 border-b border-walnut-700">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-parchment-300">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-parchment-300">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-parchment-300">Subscribed</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-parchment-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-walnut-800">
                {filteredSubscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-walnut-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-parchment-400" />
                        <span className="text-parchment-100 font-medium">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(sub.id, sub.is_active)}
                        className="flex items-center gap-2"
                      >
                        {sub.is_active ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-patina-400" />
                            <span className="text-patina-400 font-medium">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-5 w-5 text-mahogany-400" />
                            <span className="text-mahogany-400 font-medium">Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-parchment-300 text-sm">
                        <Calendar className="h-4 w-4" />
                        {formatDate(sub.subscribed_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-mahogany-600 text-parchment-50 rounded-lg hover:bg-mahogany-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-parchment-400 text-sm">
        Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
      </div>
    </div>
  );
};

export default SubscriptionsPage;

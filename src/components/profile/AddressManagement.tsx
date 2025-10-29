import React, { useEffect, useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Save, X, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ShippingAddress {
  id: string;
  full_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  special_instructions?: string;
  is_default: boolean;
}

interface AddressManagementProps {
  userId: string;
}

const AddressManagement: React.FC<AddressManagementProps> = ({ userId }) => {
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const emptyAddress: Omit<ShippingAddress, 'id'> = {
    full_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US',
    phone: '',
    special_instructions: '',
    is_default: false
  };

  const [formData, setFormData] = useState<Omit<ShippingAddress, 'id'>>(emptyAddress);

  useEffect(() => {
    fetchAddresses();
  }, [userId]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shipping_addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAddresses(data || []);
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData(emptyAddress);
    setError(null);
    setSuccess(null);
  };

  const handleEdit = (address: ShippingAddress) => {
    setEditingId(address.id);
    setIsAdding(false);
    setFormData({
      full_name: address.full_name,
      address_line1: address.address_line1,
      address_line2: address.address_line2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || '',
      special_instructions: address.special_instructions || '',
      is_default: address.is_default
    });
    setError(null);
    setSuccess(null);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData(emptyAddress);
    setError(null);
  };

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);

      if (!formData.full_name || !formData.address_line1 || !formData.city ||
          !formData.state || !formData.postal_code) {
        setError('Please fill in all required fields');
        return;
      }

      if (formData.is_default) {
        await supabase
          .from('shipping_addresses')
          .update({ is_default: false })
          .neq('id', editingId || '');
      }

      if (isAdding) {
        const { error: insertError } = await supabase
          .from('shipping_addresses')
          .insert([{ ...formData, user_id: userId }]);

        if (insertError) throw insertError;
        setSuccess('Address added successfully');
      } else if (editingId) {
        const { error: updateError } = await supabase
          .from('shipping_addresses')
          .update(formData)
          .eq('id', editingId);

        if (updateError) throw updateError;
        setSuccess('Address updated successfully');
      }

      await fetchAddresses();
      handleCancel();

      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error saving address:', err);
      setError('Failed to save address');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      setError(null);
      const { error } = await supabase
        .from('shipping_addresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Address deleted successfully');
      await fetchAddresses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setError(null);

      await supabase
        .from('shipping_addresses')
        .update({ is_default: false })
        .neq('id', id);

      const { error } = await supabase
        .from('shipping_addresses')
        .update({ is_default: true })
        .eq('id', id);

      if (error) throw error;
      setSuccess('Default address updated');
      await fetchAddresses();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error setting default address:', err);
      setError('Failed to update default address');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ember-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-900/30 border-2 border-red-600 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-patina-900/30 border-2 border-patina-600 rounded-lg p-4 flex items-center gap-2">
          <Check className="h-5 w-5 text-patina-400" />
          <p className="text-patina-400 text-sm">{success}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-parchment-50 font-display">Saved Addresses</h3>
          <p className="text-parchment-400 text-sm mt-1">Manage your shipping addresses</p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        )}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-walnut-800 rounded-xl p-6 border-2 border-forge-600">
          <h4 className="text-lg font-bold text-parchment-50 mb-4 font-display">
            {isAdding ? 'Add New Address' : 'Edit Address'}
          </h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                name="address_line1"
                value={formData.address_line1}
                onChange={handleInputChange}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors"
                placeholder="123 Main St"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                name="address_line2"
                value={formData.address_line2}
                onChange={handleInputChange}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors"
                placeholder="Apt, Suite, Unit, etc. (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors"
                placeholder="New York"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors"
                placeholder="NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Postal Code *
              </label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleInputChange}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors"
                placeholder="10001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-parchment-300 mb-2">
                Special Instructions
              </label>
              <textarea
                name="special_instructions"
                value={formData.special_instructions}
                onChange={handleInputChange}
                rows={2}
                className="w-full bg-walnut-900 border-2 border-walnut-700 rounded-lg px-4 py-2.5 text-parchment-50 focus:border-forge-500 focus:outline-none transition-colors resize-none"
                placeholder="Delivery notes (optional)"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="is_default"
                  checked={formData.is_default}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-2 border-walnut-700 bg-walnut-900 checked:bg-forge-500 checked:border-forge-500 focus:ring-2 focus:ring-forge-500 focus:ring-offset-0"
                />
                <span className="text-parchment-300 text-sm font-medium">
                  Set as default address
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Address
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 bg-walnut-800 text-parchment-300 rounded-lg font-medium hover:bg-walnut-700 hover:text-parchment-50 border-2 border-walnut-700 transition-all duration-300 flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {addresses.length === 0 && !isAdding ? (
        <div className="bg-walnut-800 rounded-xl p-12 border-2 border-walnut-700 text-center">
          <MapPin className="h-12 w-12 text-walnut-600 mx-auto mb-4" />
          <h4 className="text-lg font-bold text-parchment-50 mb-2 font-display">
            No addresses saved
          </h4>
          <p className="text-parchment-400 mb-6">
            Add your first shipping address to get started
          </p>
          <button
            onClick={handleAdd}
            className="px-6 py-2.5 bg-gradient-to-r from-forge-600 to-forge-500 text-parchment-50 rounded-lg font-semibold hover:from-forge-700 hover:to-forge-600 transition-all duration-300 shadow-forge inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {addresses.map(address => (
            <div
              key={address.id}
              className={`bg-walnut-800 rounded-xl p-6 border-2 transition-all duration-300 ${
                address.is_default
                  ? 'border-forge-500 shadow-forge'
                  : 'border-walnut-700 hover:border-walnut-600'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="h-5 w-5 text-ember-400" />
                    <h4 className="text-lg font-bold text-parchment-50 font-display">
                      {address.full_name}
                    </h4>
                    {address.is_default && (
                      <span className="px-2 py-1 bg-forge-900 text-forge-400 text-xs font-semibold rounded border border-forge-600">
                        DEFAULT
                      </span>
                    )}
                  </div>

                  <div className="text-parchment-300 space-y-1">
                    <p>{address.address_line1}</p>
                    {address.address_line2 && <p>{address.address_line2}</p>}
                    <p>
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p>{address.country}</p>
                    {address.phone && <p className="text-parchment-400 text-sm mt-2">Phone: {address.phone}</p>}
                    {address.special_instructions && (
                      <p className="text-parchment-400 text-sm mt-2 italic">
                        Note: {address.special_instructions}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="p-2 bg-walnut-700 text-parchment-300 rounded-lg hover:bg-patina-900 hover:text-patina-400 border-2 border-walnut-600 hover:border-patina-600 transition-all duration-300"
                      title="Set as default"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(address)}
                    className="p-2 bg-walnut-700 text-parchment-300 rounded-lg hover:bg-forge-900 hover:text-forge-400 border-2 border-walnut-600 hover:border-forge-600 transition-all duration-300"
                    title="Edit address"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="p-2 bg-walnut-700 text-parchment-300 rounded-lg hover:bg-red-900 hover:text-red-400 border-2 border-walnut-600 hover:border-red-600 transition-all duration-300"
                    title="Delete address"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddressManagement;

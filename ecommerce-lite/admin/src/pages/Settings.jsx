import { useState, useEffect } from 'react';
import api from '../../../services/api';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: '',
    logo: '',
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    whatsappNotifications: true,
    currency: 'USD',
    currencySymbol: '$',
    shippingFee: 0,
    taxRate: 0,
    aboutUs: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: ''
    },
    faqs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/settings');
        setSettings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSocialMediaChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await api.put('/admin/settings', settings);
      setSuccess('Settings updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings.storeName) {
    return <div className="flex justify-center items-center h-64">Loading settings...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Store Settings</h1>
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">General Settings</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Store Name *
                </label>
                <input
                  type="text"
                  name="storeName"
                  id="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  required
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency *
                </label>
                <select
                  id="currency"
                  name="currency"
                  value={settings.currency}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  required
                >
                  <option value="USD">US Dollar (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                  <option value="GBP">British Pound (GBP)</option>
                  <option value="INR">Indian Rupee (INR)</option>
                </select>
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="currencySymbol" className="block text-sm font-medium text-gray-700">
                  Currency Symbol *
                </label>
                <input
                  type="text"
                  name="currencySymbol"
                  id="currencySymbol"
                  value={settings.currencySymbol}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  required
                  maxLength="3"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700">
                  Shipping Fee
                </label>
                <input
                  type="number"
                  name="shippingFee"
                  id="shippingFee"
                  min="0"
                  step="0.01"
                  value={settings.shippingFee}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  name="taxRate"
                  id="taxRate"
                  min="0"
                  max="100"
                  step="0.1"
                  value={settings.taxRate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-6">
                <div className="flex items-center">
                  <input
                    id="whatsappNotifications"
                    name="whatsappNotifications"
                    type="checkbox"
                    checked={settings.whatsappNotifications}
                    onChange={(e) => setSettings({...settings, whatsappNotifications: e.target.checked})}
                    className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                  />
                  <label htmlFor="whatsappNotifications" className="ml-2 block text-sm text-gray-700">
                    Enable WhatsApp Notifications
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                  Contact Email
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  id="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  id="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  id="address"
                  rows={3}
                  value={settings.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
              
              <div className="sm:col-span-6">
                <label htmlFor="aboutUs" className="block text-sm font-medium text-gray-700">
                  About Us
                </label>
                <textarea
                  name="aboutUs"
                  id="aboutUs"
                  rows={4}
                  value={settings.aboutUs}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Social Media</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700">
                  Facebook
                </label>
                <input
                  type="url"
                  name="facebook"
                  id="facebook"
                  value={settings.socialMedia.facebook}
                  onChange={handleSocialMediaChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700">
                  Instagram
                </label>
                <input
                  type="url"
                  name="instagram"
                  id="instagram"
                  value={settings.socialMedia.instagram}
                  onChange={handleSocialMediaChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="https://instagram.com/yourpage"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="twitter" className="block text-sm font-medium text-gray-700">
                  Twitter
                </label>
                <input
                  type="url"
                  name="twitter"
                  id="twitter"
                  value={settings.socialMedia.twitter}
                  onChange={handleSocialMediaChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="https://twitter.com/yourpage"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700">
                  YouTube
                </label>
                <input
                  type="url"
                  name="youtube"
                  id="youtube"
                  value={settings.socialMedia.youtube}
                  onChange={handleSocialMediaChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="https://youtube.com/yourchannel"
                />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">
                  LinkedIn
                </label>
                <input
                  type="url"
                  name="linkedin"
                  id="linkedin"
                  value={settings.socialMedia.linkedin}
                  onChange={handleSocialMediaChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;

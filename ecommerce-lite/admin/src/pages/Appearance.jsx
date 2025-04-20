import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { ChromePicker } from 'react-color';

const Appearance = () => {
  const [settings, setSettings] = useState({
    primaryColor: '#4F46E5',
    secondaryColor: '#10B981',
    accentColor: '#F59E0B',
    logo: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(null); // 'primary', 'secondary', 'accent'

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/settings');
        setSettings({
          primaryColor: response.data.primaryColor,
          secondaryColor: response.data.secondaryColor,
          accentColor: response.data.accentColor,
          logo: response.data.logo
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleColorChange = (color, type) => {
    setSettings(prev => ({
      ...prev,
      [type]: color.hex
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('logo', file);
      
      const response = await api.put('/admin/settings/logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setSettings(prev => ({
        ...prev,
        logo: response.data.logo
      }));
      setSuccess('Logo updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload logo');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await api.put('/admin/settings/colors', {
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        accentColor: settings.accentColor
      });
      
      setSuccess('Color settings updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update color settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !settings.primaryColor) {
    return <div className="flex justify-center items-center h-64">Loading appearance settings...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-64 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appearance</h1>
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500">
          <p className="text-sm text-green-700">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Logo</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="mr-4">
                {settings.logo ? (
                  <img src={settings.logo} alt="Store Logo" className="h-16 w-16 object-contain" />
                ) : (
                  <div className="h-16 w-16 bg-gray-200 flex items-center justify-center text-gray-400">
                    No logo
                  </div>
                )}
              </div>
              <div>
                <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                  Change Logo
                  <input type="file" className="sr-only" onChange={handleImageUpload} accept="image/*" />
                </label>
                <p className="mt-1 text-xs text-gray-500">Recommended size: 200x200px</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Color Scheme</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="relative">
                  <div 
                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: settings.primaryColor }}
                    onClick={() => setShowColorPicker(showColorPicker === 'primary' ? null : 'primary')}
                  />
                  {showColorPicker === 'primary' && (
                    <div className="absolute z-10 mt-2">
                      <ChromePicker
                        color={settings.primaryColor}
                        onChange={(color) => handleColorChange(color, 'primaryColor')}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(null)}
                          className="px-3 py-1 bg-black text-white rounded text-sm"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="relative">
                  <div 
                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: settings.secondaryColor }}
                    onClick={() => setShowColorPicker(showColorPicker === 'secondary' ? null : 'secondary')}
                  />
                  {showColorPicker === 'secondary' && (
                    <div className="absolute z-10 mt-2">
                      <ChromePicker
                        color={settings.secondaryColor}
                        onChange={(color) => handleColorChange(color, 'secondaryColor')}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(null)}
                          className="px-3 py-1 bg-black text-white rounded text-sm"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="relative">
                  <div 
                    className="h-10 w-full rounded border border-gray-300 cursor-pointer"
                    style={{ backgroundColor: settings.accentColor }}
                    onClick={() => setShowColorPicker(showColorPicker === 'accent' ? null : 'accent')}
                  />
                  {showColorPicker === 'accent' && (
                    <div className="absolute z-10 mt-2">
                      <ChromePicker
                        color={settings.accentColor}
                        onChange={(color) => handleColorChange(color, 'accentColor')}
                      />
                      <div className="mt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowColorPicker(null)}
                          className="px-3 py-1 bg-black text-white rounded text-sm"
                        >
                          OK
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
              <div>
                <div className="h-10 flex items-center justify-center text-white rounded"
                  style={{ backgroundColor: settings.primaryColor }}>
                  Primary
                </div>
              </div>
              <div>
                <div className="h-10 flex items-center justify-center text-white rounded"
                  style={{ backgroundColor: settings.secondaryColor }}>
                  Secondary
                </div>
              </div>
              <div>
                <div className="h-10 flex items-center justify-center text-black rounded"
                  style={{ backgroundColor: settings.accentColor }}>
                  Accent
                </div>
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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Appearance;

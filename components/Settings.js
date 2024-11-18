import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useRouter } from 'next/router';
import { useSettings } from '../contexts/SettingsContext';

const Settings = () => {
  const router = useRouter();
  const { settings: globalSettings, setSettings: setGlobalSettings } = useSettings();
  const [settings, setSettings] = useState(globalSettings);
  const [saveStatus, setSaveStatus] = useState(''); // Add this line

/*const Settings = () => {
  const router = useRouter();
  const [settings, setSettings] = useState({
    model: 'llama3.1:8b-instruct-q5_K_S',
    primaryColor: '#7C3AED',
    fontFamily: 'Arial',
    storageMethod: 'JSON',
  });
  const [saveStatus, setSaveStatus] = useState('');
  */

  useEffect(() => {
    setSettings(globalSettings);
  }, [globalSettings]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) throw new Error('Failed to save settings');
      
      setGlobalSettings(settings); // Update global settings
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('Error saving settings');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <button
        onClick={() => router.push('/')}
        className="text-blue-500 hover:underline mb-4 flex items-center"
      >
        &larr; Back
      </button>

      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium">Ollama Model</label>
          <input
            type="text"
            value={settings.model}
            onChange={(e) => setSettings({...settings, model: e.target.value})}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Title Color</label>
          <div className="flex gap-2">
            <input
              type="color"
              value={settings.primaryColor}
              onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
              className="h-10"
            />
            <input
              type="text"
              value={settings.primaryColor}
              onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Font Family</label>
          <select
            value={settings.fontFamily}
            onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="Arial">Arial</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Storage Method</label>
          <select
            value={settings.storageMethod}
            onChange={(e) => setSettings({...settings, storageMethod: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="JSON">JSON</option>
            <option value="SQLITE">SQLite</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>

        {saveStatus && (
          <div
            className={`text-center p-2 rounded ${
              saveStatus.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {saveStatus}
          </div>
        )}
      </form>
    </div>
  );
};

export default Settings;
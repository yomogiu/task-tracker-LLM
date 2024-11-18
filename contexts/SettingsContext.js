import { createContext, useContext, useEffect, useState } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    model: 'llama3.1:8b-instruct-q5_K_S',
    primaryColor: '#7C3AED',
    fontFamily: 'Arial',
    storageMethod: 'JSON',
  });

  useEffect(() => {
    // Load settings when provider mounts
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  useEffect(() => {
    // Apply settings to root element
    const root = document.documentElement;
    root.style.setProperty('--primary-color', settings.primaryColor);
    document.body.style.fontFamily = settings.fontFamily;
  }, [settings.primaryColor, settings.fontFamily]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
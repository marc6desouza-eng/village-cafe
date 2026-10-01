import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [bootstrapData, setBootstrapData] = useState({
    hours: null,
    contact: null,
    settings: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchBootstrapData = useCallback(async () => {
    try {
      const res = await api.get('/settings/bootstrap');
      if (res.data.success) {
        setBootstrapData(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load site settings:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBootstrapData();
  }, [fetchBootstrapData]);

  return (
    <SettingsContext.Provider
      value={{
        hours: bootstrapData.hours,
        contact: bootstrapData.contact,
        settings: bootstrapData.settings,
        openStatus: bootstrapData.hours?.openStatus || null,
        isLoading,
        refreshSettings: fetchBootstrapData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

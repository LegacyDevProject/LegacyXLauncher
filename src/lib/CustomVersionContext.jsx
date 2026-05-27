import React, { createContext, useContext, useState, useEffect } from 'react';

const CustomVersionContext = createContext();

export function CustomVersionProvider({ children }) {
  const [customVersions, setCustomVersions] = useState(() => {
    try {
      const saved = localStorage.getItem('lx-custom-versions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('lx-custom-versions', JSON.stringify(customVersions));
  }, [customVersions]);

  const addVersion = (version) => {
    const newVersion = {
      ...version,
      id: `custom-${Date.now()}`,
      created_date: new Date().toISOString(),
      is_imported: false,
    };
    setCustomVersions(prev => [...prev, newVersion]);
    return newVersion;
  };

  const updateVersion = (id, data) => {
    setCustomVersions(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
  };

  const deleteVersion = (id) => {
    setCustomVersions(prev => prev.filter(v => v.id !== id));
  };

  const duplicateVersion = (id) => {
    const original = customVersions.find(v => v.id === id);
    if (!original) return;
    const copy = {
      ...original,
      id: `custom-${Date.now()}`,
      name: `${original.name} (Copy)`,
      created_date: new Date().toISOString(),
      is_imported: false,
    };
    setCustomVersions(prev => [...prev, copy]);
    return copy;
  };

  const exportVersion = (id) => {
    const version = customVersions.find(v => v.id === id);
    if (!version) return;
    const blob = new Blob([JSON.stringify(version, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${version.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importVersion = (jsonData) => {
    const version = {
      ...jsonData,
      id: `custom-${Date.now()}`,
      created_date: new Date().toISOString(),
      is_imported: true,
    };
    setCustomVersions(prev => [...prev, version]);
    return version;
  };

  const isNameUnique = (name, excludeId = null) => {
    return !customVersions.some(v => v.name.toLowerCase() === name.toLowerCase() && v.id !== excludeId);
  };

  return (
    <CustomVersionContext.Provider value={{
      customVersions,
      addVersion,
      updateVersion,
      deleteVersion,
      duplicateVersion,
      exportVersion,
      importVersion,
      isNameUnique,
    }}>
      {children}
    </CustomVersionContext.Provider>
  );
}

export const useCustomVersions = () => useContext(CustomVersionContext);
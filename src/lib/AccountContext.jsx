import React, { createContext, useContext, useState, useEffect } from 'react';

const AccountContext = createContext();

const DEFAULT_ACCOUNTS = [];

export function AccountProvider({ children }) {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem('lx-accounts');
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  const [activeAccountId, setActiveAccountId] = useState(() => {
    return localStorage.getItem('lx-active-account') || null;
  });

  useEffect(() => {
    localStorage.setItem('lx-accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('lx-active-account', activeAccountId || '');
  }, [activeAccountId]);

  const activeAccount = accounts.find(a => a.id === activeAccountId) || null;

  const addAccount = (account) => {
    const newAccount = { ...account, id: Date.now().toString() };
    setAccounts(prev => [...prev, newAccount]);
    if (!activeAccountId) setActiveAccountId(newAccount.id);
    return newAccount;
  };

  const removeAccount = (id) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
    if (activeAccountId === id) {
      const remaining = accounts.filter(a => a.id !== id);
      setActiveAccountId(remaining.length > 0 ? remaining[0].id : null);
    }
  };

  const switchAccount = (id) => setActiveAccountId(id);

  return (
    <AccountContext.Provider value={{
      accounts, activeAccount, activeAccountId,
      addAccount, removeAccount, switchAccount
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export const useAccount = () => useContext(AccountContext);
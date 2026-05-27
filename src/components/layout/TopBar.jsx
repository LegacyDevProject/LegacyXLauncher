import React, { useState } from 'react';
import { Search, Palette, User, ChevronDown, Crown, Wifi, WifiOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { useAccount } from '@/lib/AccountContext';
import { useTheme } from '@/lib/ThemeContext';
import { THEMES } from '@/lib/mockData';

export default function TopBar({ onSearch }) {
  const { activeAccount, accounts, switchAccount } = useAccount();
  const { theme, setTheme } = useTheme();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Search */}
      <div className="relative w-64 hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearch}
          className="pl-9 bg-secondary/50 border-border/50 h-9 text-sm"
        />
      </div>

      <div className="md:hidden" />

      <div className="flex items-center gap-2">
        {/* Theme Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Palette className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {THEMES.map(t => (
              <DropdownMenuItem
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="flex items-center gap-2"
              >
                <div className="flex gap-0.5">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.bg }} />
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.colors.accent }} />
                </div>
                <span className="text-sm">{t.name}</span>
                {theme === t.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
                {activeAccount ? (
                  <span className="text-xs font-bold text-primary">
                    {activeAccount.username[0].toUpperCase()}
                  </span>
                ) : (
                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-medium leading-none">
                  {activeAccount?.username || 'No Account'}
                </p>
                {activeAccount && (
                  <div className="flex items-center gap-1 mt-0.5">
                    {activeAccount.type === 'premium' ? (
                      <Crown className="w-2.5 h-2.5 text-warning" />
                    ) : (
                      <WifiOff className="w-2.5 h-2.5 text-muted-foreground" />
                    )}
                    <span className="text-[10px] text-muted-foreground capitalize">{activeAccount.type}</span>
                  </div>
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden sm:block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>Accounts</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {accounts.map(acc => (
              <DropdownMenuItem
                key={acc.id}
                onClick={() => switchAccount(acc.id)}
                className="flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">{acc.username[0].toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium">{acc.username}</p>
                  <p className="text-[10px] text-muted-foreground capitalize">{acc.type}</p>
                </div>
                {acc.id === activeAccount?.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </DropdownMenuItem>
            ))}
            {accounts.length === 0 && (
              <DropdownMenuItem disabled>
                <span className="text-xs text-muted-foreground">No accounts added</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
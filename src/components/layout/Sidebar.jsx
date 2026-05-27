import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Box, Package, Globe, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/instances', label: 'Instances', icon: Box },
  { path: '/mods', label: 'Mods', icon: Package },
  { path: '/servers', label: 'Servers', icon: Globe },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[72px] lg:w-[220px] bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      {/* Logo */}
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm tracking-tighter" style={{ fontFamily: "'JetBrains Mono', monospace" }}>LX</span>
          </div>
          <div className="hidden lg:block">
            <h1 className="text-foreground font-bold text-base leading-none">LegacyX</h1>
            <p className="text-muted-foreground text-[10px] mt-0.5 tracking-wide">Play your way.</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
          const isActive = path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);
          return (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                "justify-center lg:justify-start",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-sidebar-primary")} />
              <span className="hidden lg:block text-sm font-medium">{label}</span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-sidebar-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Version */}
      <div className="p-3 border-t border-sidebar-border">
        <p className="text-[10px] text-muted-foreground text-center lg:text-left font-mono">v1.0.0</p>
      </div>
    </aside>
  );
}
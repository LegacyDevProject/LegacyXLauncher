import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { useTheme } from '@/lib/ThemeContext';
import { THEMES } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">Theme</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {THEMES.map(t => (
          <Card
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={cn(
              "p-3 cursor-pointer transition-all hover:scale-[1.02]",
              theme === t.id ? "ring-2 ring-primary" : "hover:border-primary/30"
            )}
          >
            {/* Mini mockup */}
            <div className="rounded-md overflow-hidden mb-2.5 h-16 relative" style={{ backgroundColor: t.colors.bg }}>
              {/* Sidebar */}
              <div className="absolute left-0 top-0 bottom-0 w-5" style={{ backgroundColor: t.colors.card }}>
                <div className="mt-2 mx-1 space-y-1">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-3 h-1 rounded-full opacity-40" style={{ backgroundColor: t.colors.text }} />
                  ))}
                </div>
              </div>
              {/* Content */}
              <div className="ml-7 mt-2 mr-2">
                <div className="h-5 rounded-sm" style={{ backgroundColor: t.colors.accent, opacity: 0.3 }} />
                <div className="mt-1.5 flex gap-1">
                  <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: t.colors.card }} />
                  <div className="h-3 w-8 rounded-sm" style={{ backgroundColor: t.colors.card }} />
                </div>
              </div>
              {/* Accent dot */}
              <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: t.colors.accent }} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">{t.name}</p>
                <p className="text-[10px] text-muted-foreground">{t.description}</p>
              </div>
              {theme === t.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
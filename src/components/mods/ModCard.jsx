import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { formatDownloads } from '@/lib/mockData';
import { toast } from 'sonner';

export default function ModCard({ mod }) {
  const handleInstall = () => {
    toast.success(`Installing ${mod.name}...`, {
      description: 'Mod will be added to your active instance',
    });
  };

  return (
    <Card className="p-4 hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start gap-3">
        <img
          src={mod.icon}
          alt={mod.name}
          className="w-11 h-11 rounded-lg object-cover shrink-0 bg-muted"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold">{mod.name}</h3>
              <p className="text-[11px] text-muted-foreground">by {mod.author}</p>
            </div>
            <Badge
              variant="outline"
              className={`text-[9px] shrink-0 ${mod.source === 'modrinth' ? 'border-green-500/30 text-green-400' : 'border-orange-500/30 text-orange-400'}`}
            >
              {mod.source === 'modrinth' ? 'Modrinth' : 'CurseForge'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{mod.description}</p>
          <div className="flex items-center gap-3 mt-2.5 flex-wrap">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Download className="w-3 h-3" />
              {formatDownloads(mod.downloads)}
            </div>
            <div className="flex gap-1 flex-wrap">
              {mod.loaders.slice(0, 3).map(l => (
                <Badge key={l} variant="secondary" className="text-[9px] px-1 py-0 h-[16px] capitalize">{l}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
        <Button size="sm" className="flex-1 h-7 text-xs" onClick={handleInstall}>
          <Download className="w-3 h-3 mr-1" /> Install
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <ExternalLink className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
}
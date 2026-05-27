import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Pencil, Trash2, Box, Clock, Wrench } from 'lucide-react';
import { useCustomVersions } from '@/lib/CustomVersionContext';
import { toast } from 'sonner';
import { useAccount } from '@/lib/AccountContext';

export default function InstanceCard({ instance, onEdit, onDelete }) {
  const { activeAccount } = useAccount();
  const { customVersions } = useCustomVersions();
  const customVersion = instance.custom_version_id
    ? customVersions.find(v => v.id === instance.custom_version_id)
    : null;

  const handlePlay = (e) => {
    e.stopPropagation();
    if (!activeAccount) {
      toast.error('No account selected');
      return;
    }
    toast.success(`Launching ${instance.name}...`, {
      description: `${instance.minecraft_version} • ${instance.mod_loader}`,
    });
  };

  const loaderColors = {
    vanilla: 'bg-secondary text-secondary-foreground',
    forge: 'bg-orange-500/15 text-orange-400',
    fabric: 'bg-blue-500/15 text-blue-400',
    neoforge: 'bg-red-500/15 text-red-400',
    quilt: 'bg-purple-500/15 text-purple-400',
  };

  return (
    <Card className="group hover:border-primary/30 transition-all duration-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 relative">
            {customVersion ? (
              <span className="text-2xl">{customVersion.icon || '⚙️'}</span>
            ) : instance.icon_url ? (
              <img src={instance.icon_url} alt="" className="w-full h-full rounded-lg object-cover" />
            ) : (
              <Box className="w-6 h-6 text-primary" />
            )}
            {customVersion && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <Wrench className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{instance.name}</h3>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {customVersion ? (
                <>
                  <Badge className="text-[10px] px-1.5 py-0 h-[18px] bg-primary/15 text-primary border-0">
                    [Custom] {customVersion.name}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-[18px]">
                    {customVersion.base_version}
                  </Badge>
                </>
              ) : (
                <>
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-[18px]">
                    {instance.minecraft_version}
                  </Badge>
                  <Badge className={`text-[10px] px-1.5 py-0 h-[18px] border-0 capitalize ${loaderColors[instance.mod_loader] || loaderColors.vanilla}`}>
                    {instance.mod_loader}
                  </Badge>
                </>
              )}
            </div>
            {instance.description && (
              <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{instance.description}</p>
            )}
          </div>
        </div>

        {instance.play_time_minutes > 0 && (
          <div className="flex items-center gap-1 mt-3 text-[10px] text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{Math.floor(instance.play_time_minutes / 60)}h {instance.play_time_minutes % 60}m played</span>
          </div>
        )}

        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          <Button size="sm" className="flex-1 h-8 text-xs" onClick={handlePlay}>
            <Play className="w-3 h-3 mr-1 fill-current" /> Play
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(instance)}>
            <Pencil className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => onDelete(instance)}>
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
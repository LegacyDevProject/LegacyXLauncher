import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function RecentInstances({ instances, isLoading }) {
  if (isLoading) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recently Played</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1,2,3].map(i => (
            <Card key={i} className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const recent = instances
    ?.filter(i => i.last_played)
    .sort((a, b) => new Date(b.last_played) - new Date(a.last_played))
    .slice(0, 6) || [];

  if (recent.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recently Played</h3>
        <Card className="p-8 flex flex-col items-center justify-center text-center border-dashed">
          <Box className="w-10 h-10 text-muted-foreground/40 mb-3" />
          <p className="text-sm text-muted-foreground">No instances played yet</p>
          <Link to="/instances">
            <Button variant="link" size="sm" className="mt-1">Create your first instance</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recently Played</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recent.map(instance => (
          <Card key={instance.id} className="p-3 hover:bg-secondary/50 transition-colors group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                {instance.icon_url ? (
                  <img src={instance.icon_url} alt="" className="w-full h-full rounded-lg object-cover" />
                ) : (
                  <Box className="w-5 h-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{instance.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-muted-foreground">{instance.minecraft_version}</span>
                  {instance.mod_loader !== 'vanilla' && (
                    <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 capitalize">
                      {instance.mod_loader}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-3.5 h-3.5 fill-current" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Wifi, WifiOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function ServerStatusWidget({ servers, isLoading }) {
  if (isLoading) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Servers</h3>
        <div className="space-y-2">
          {[1, 2].map(i => (
            <Card key={i} className="p-3">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-3.5 w-28 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const savedServers = servers?.slice(0, 4) || [];

  if (savedServers.length === 0) {
    return (
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Servers</h3>
        <Card className="p-6 flex flex-col items-center text-center border-dashed">
          <Globe className="w-8 h-8 text-muted-foreground/40 mb-2" />
          <p className="text-xs text-muted-foreground">No saved servers</p>
          <Link to="/servers">
            <Button variant="link" size="sm" className="text-xs mt-1">Add a server</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Servers</h3>
      <div className="space-y-2">
        {savedServers.map(server => (
          <Card key={server.id} className="p-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center shrink-0">
                <Globe className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{server.name}</p>
                <p className="text-[10px] text-muted-foreground">{server.address}</p>
              </div>
              <div className="flex items-center gap-2">
                {server.is_online ? (
                  <>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{server.players_online}/{server.max_players}</span>
                    </div>
                    <Badge className="bg-success/20 text-success border-0 text-[9px] px-1.5">
                      <Wifi className="w-2.5 h-2.5 mr-0.5" />Online
                    </Badge>
                  </>
                ) : (
                  <Badge variant="outline" className="text-[9px] px-1.5 text-muted-foreground">
                    <WifiOff className="w-2.5 h-2.5 mr-0.5" />Offline
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
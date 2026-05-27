const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Plus, Globe, Users, Wifi, WifiOff, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Servers() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', port: 25565 });
  const queryClient = useQueryClient();

  const { data: servers = [], isLoading } = useQuery({
    queryKey: ['servers'],
    queryFn: () => db.entities.ServerEntry.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.ServerEntry.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server added!');
      setDialogOpen(false);
      setForm({ name: '', address: '', port: 25565 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.ServerEntry.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servers'] });
      toast.success('Server removed');
    },
  });

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['servers'] });
    toast.info('Refreshing server status...');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Servers</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your multiplayer servers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Server
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3].map(i => (
            <div key={i} className="h-20 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : servers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-lg">No servers saved</h3>
          <p className="text-sm text-muted-foreground mt-1">Add a server to track its status</p>
          <Button className="mt-4" onClick={() => setDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Server
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {servers.map(server => (
            <Card key={server.id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Globe className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm">{server.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{server.address}:{server.port}</p>
                  {server.description && (
                    <p className="text-xs text-muted-foreground mt-1">{server.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {server.is_online ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="w-3.5 h-3.5" />
                        {server.players_online}/{server.max_players}
                      </div>
                      <Badge className="bg-success/20 text-success border-0 text-xs">
                        <Wifi className="w-3 h-3 mr-1" />Online
                      </Badge>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      <WifiOff className="w-3 h-3 mr-1" />Offline
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => deleteMutation.mutate(server.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Add Server</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Server Name</Label>
              <Input placeholder="My Server" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Address</Label>
              <Input placeholder="play.example.com" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Port</Label>
              <Input type="number" value={form.port} onChange={e => setForm(f => ({ ...f, port: parseInt(e.target.value) || 25565 }))} className="mt-1" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate(form)} disabled={!form.name || !form.address}>Add Server</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
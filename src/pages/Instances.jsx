const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import { Plus, Search, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import InstanceCard from '@/components/instances/InstanceCard';
import CreateInstanceDialog from '@/components/instances/CreateInstanceDialog';

export default function Instances() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editInstance, setEditInstance] = useState(null);
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: instances = [], isLoading } = useQuery({
    queryKey: ['instances'],
    queryFn: () => db.entities.Instance.list('-updated_date'),
  });

  const createMutation = useMutation({
    mutationFn: (data) => db.entities.Instance.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance created!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.Instance.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance updated!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.entities.Instance.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['instances'] });
      toast.success('Instance deleted');
    },
  });

  const handleSave = async (form) => {
    if (editInstance) {
      await updateMutation.mutateAsync({ id: editInstance.id, data: form });
    } else {
      await createMutation.mutateAsync(form);
    }
    setEditInstance(null);
  };

  const handleEdit = (inst) => {
    setEditInstance(inst);
    setDialogOpen(true);
  };

  const handleDelete = (inst) => {
    deleteMutation.mutate(inst.id);
  };

  const filtered = instances.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.minecraft_version.includes(search)
  );

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Instances</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your Minecraft installations</p>
        </div>
        <Button onClick={() => { setEditInstance(null); setDialogOpen(true); }}>
          <Plus className="w-4 h-4 mr-1.5" /> New Instance
        </Button>
      </div>

      <div className="relative w-full sm:w-72 mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search instances..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-48 rounded-xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Box className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <h3 className="font-semibold text-lg">No instances found</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs">
            {search ? 'Try a different search term' : 'Create your first instance to start playing Minecraft'}
          </p>
          {!search && (
            <Button className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" /> Create Instance
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(inst => (
            <InstanceCard
              key={inst.id}
              instance={inst}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateInstanceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        editInstance={editInstance}
      />
    </motion.div>
  );
}
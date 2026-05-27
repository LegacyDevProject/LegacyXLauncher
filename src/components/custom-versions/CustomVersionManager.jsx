const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, Plus, Pencil, Copy, Trash2, Download, Upload } from 'lucide-react';
import { useCustomVersions } from '@/lib/CustomVersionContext';
import { useQuery } from '@tanstack/react-query';

import CustomVersionForm from './CustomVersionForm';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function CustomVersionManager() {
  const { customVersions, deleteVersion, duplicateVersion, exportVersion, importVersion } = useCustomVersions();
  const [formOpen, setFormOpen] = useState(false);
  const [editVersion, setEditVersion] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const importRef = useRef();

  const { data: instances = [] } = useQuery({
    queryKey: ['instances'],
    queryFn: () => db.entities.Instance.list(),
    initialData: [],
  });

  const getUsageCount = (versionId) =>
    instances.filter(i => i.custom_version_id === versionId).length;

  const handleEdit = (v) => { setEditVersion(v); setFormOpen(true); };
  const handleNew = () => { setEditVersion(null); setFormOpen(true); };

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return;
    deleteVersion(deleteTarget.id);
    toast.success(`Deleted "${deleteTarget.name}"`);
    setDeleteTarget(null);
  };

  const handleDuplicate = (v) => {
    const copy = duplicateVersion(v.id);
    toast.success(`Duplicated as "${copy.name}"`);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        const imported = importVersion(data);
        toast.success(`Imported "${imported.name}"`);
      } catch {
        toast.error('Invalid JSON file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const loaderColor = {
    none: 'bg-secondary text-secondary-foreground',
    forge: 'bg-orange-500/15 text-orange-400',
    fabric: 'bg-blue-500/15 text-blue-400',
    neoforge: 'bg-red-500/15 text-red-400',
    quilt: 'bg-purple-500/15 text-purple-400',
    liteloader: 'bg-yellow-500/15 text-yellow-400',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-1.5">
          <Wrench className="w-4 h-4 text-primary" />
          Custom Versions
        </h3>
        <div className="flex gap-2">
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <Button variant="outline" size="sm" onClick={() => importRef.current?.click()}>
            <Upload className="w-3.5 h-3.5 mr-1" /> Import
          </Button>
          <Button size="sm" onClick={handleNew}>
            <Plus className="w-3.5 h-3.5 mr-1" /> New
          </Button>
        </div>
      </div>

      {customVersions.length === 0 ? (
        <Card className="p-8 text-center border-dashed">
          <Wrench className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No custom versions yet</p>
          <Button variant="link" size="sm" onClick={handleNew}>Create your first custom version</Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {customVersions.map(v => {
            const usageCount = getUsageCount(v.id);
            return (
              <Card key={v.id} className="p-3 hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="text-2xl w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {v.icon || '⚙️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium">{v.name}</p>
                      {v.is_imported && (
                        <Badge variant="outline" className="text-[9px] px-1.5 text-muted-foreground">Imported</Badge>
                      )}
                      {usageCount > 0 && (
                        <Badge className="text-[9px] px-1.5 bg-primary/10 text-primary border-0">
                          {usageCount} instance{usageCount > 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[10px] text-muted-foreground">{v.base_version}</span>
                      {v.mod_loader_override !== 'none' && (
                        <Badge className={`text-[9px] px-1.5 py-0 h-[16px] border-0 capitalize ${loaderColor[v.mod_loader_override] || loaderColor.none}`}>
                          {v.mod_loader_override}
                        </Badge>
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {format(new Date(v.created_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(v)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDuplicate(v)}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => exportVersion(v.id)}>
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(v)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <CustomVersionForm open={formOpen} onOpenChange={setFormOpen} editVersion={editVersion} />

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{deleteTarget?.name}"?</AlertDialogTitle>
            <AlertDialogDescription>
              {getUsageCount(deleteTarget?.id) > 0
                ? `This version is used by ${getUsageCount(deleteTarget?.id)} instance(s). Deleting it may break those instances.`
                : 'This action cannot be undone.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
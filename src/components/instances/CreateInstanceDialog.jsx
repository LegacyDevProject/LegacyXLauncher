import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { MINECRAFT_VERSIONS, MOD_LOADERS } from '@/lib/mockData';
import { Loader2, Wrench } from 'lucide-react';
import { useCustomVersions } from '@/lib/CustomVersionContext';

const CUSTOM_PREFIX = 'custom::';

export default function CreateInstanceDialog({ open, onOpenChange, onSave, editInstance }) {
  const { customVersions } = useCustomVersions();

  const getDefault = () => ({
    name: '',
    minecraft_version: '1.21.5',
    mod_loader: 'vanilla',
    mod_loader_version: '',
    description: '',
    icon_url: '',
    custom_version_id: null,
  });

  const [form, setForm] = useState(editInstance || getDefault());
  const [showSnapshots, setShowSnapshots] = useState(false);
  const [showLegacy, setShowLegacy] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(editInstance || getDefault());
  }, [open, editInstance]);

  // Determine the current version selector value
  const versionSelectVal = form.custom_version_id
    ? `${CUSTOM_PREFIX}${form.custom_version_id}`
    : form.minecraft_version;

  const handleVersionChange = (val) => {
    if (val.startsWith(CUSTOM_PREFIX)) {
      const id = val.replace(CUSTOM_PREFIX, '');
      const cv = customVersions.find(v => v.id === id);
      setForm(f => ({
        ...f,
        custom_version_id: id,
        minecraft_version: cv?.base_version || f.minecraft_version,
        mod_loader: cv?.mod_loader_override !== 'none' ? cv?.mod_loader_override || 'vanilla' : 'vanilla',
        mod_loader_version: cv?.mod_loader_version_str || '',
      }));
    } else {
      setForm(f => ({ ...f, custom_version_id: null, minecraft_version: val, mod_loader_version: '' }));
    }
  };

  const officialVersions = [
    ...MINECRAFT_VERSIONS.releases,
    ...(showSnapshots ? MINECRAFT_VERSIONS.snapshots : []),
    ...(showLegacy ? [...MINECRAFT_VERSIONS.oldBeta, ...MINECRAFT_VERSIONS.oldAlpha] : []),
  ];

  const loaderVersions = !form.custom_version_id && form.mod_loader !== 'vanilla'
    ? MOD_LOADERS[form.mod_loader]?.[form.minecraft_version] || []
    : [];

  const selectedCustomVersion = form.custom_version_id
    ? customVersions.find(v => v.id === form.custom_version_id)
    : null;

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editInstance ? 'Edit Instance' : 'Create New Instance'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-xs">Instance Name</Label>
            <Input
              placeholder="My awesome modpack"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-xs">Minecraft Version</Label>
            <Select value={versionSelectVal} onValueChange={handleVersionChange}>
              <SelectTrigger className="mt-1">
                <SelectValue>
                  {selectedCustomVersion
                    ? <span className="flex items-center gap-1.5">{selectedCustomVersion.icon} {selectedCustomVersion.name}</span>
                    : form.minecraft_version}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {customVersions.length > 0 && (
                  <>
                    <SelectGroup>
                      <SelectLabel className="flex items-center gap-1.5">
                        <Wrench className="w-3 h-3" /> Custom
                      </SelectLabel>
                      {customVersions.map(cv => (
                        <SelectItem key={cv.id} value={`${CUSTOM_PREFIX}${cv.id}`}>
                          <span className="flex items-center gap-2">
                            <span>{cv.icon || '⚙️'}</span>
                            <span>{cv.name}</span>
                            <Badge className="text-[9px] px-1 py-0 h-4 bg-primary/15 text-primary border-0">[Custom]</Badge>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectSeparator />
                  </>
                )}
                <SelectGroup>
                  <SelectLabel>Releases</SelectLabel>
                  {MINECRAFT_VERSIONS.releases.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                </SelectGroup>
                {showSnapshots && (
                  <SelectGroup>
                    <SelectLabel>Snapshots</SelectLabel>
                    {MINECRAFT_VERSIONS.snapshots.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectGroup>
                )}
                {showLegacy && (
                  <>
                    <SelectGroup>
                      <SelectLabel>Old Beta</SelectLabel>
                      {MINECRAFT_VERSIONS.oldBeta.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Old Alpha</SelectLabel>
                      {MINECRAFT_VERSIONS.oldAlpha.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                    </SelectGroup>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Custom version info banner */}
          {selectedCustomVersion && (
            <div className="rounded-lg bg-primary/8 border border-primary/20 px-3 py-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Custom:</span> Base {selectedCustomVersion.base_version}
              {selectedCustomVersion.mod_loader_override !== 'none' && ` • ${selectedCustomVersion.mod_loader_override} ${selectedCustomVersion.mod_loader_version_str}`}
            </div>
          )}

          {/* Standard mod loader selector (only when not using custom) */}
          {!form.custom_version_id && (
            <div>
              <Label className="text-xs">Mod Loader</Label>
              <Select value={form.mod_loader} onValueChange={v => setForm(f => ({ ...f, mod_loader: v, mod_loader_version: '' }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="vanilla">Vanilla</SelectItem>
                  <SelectItem value="forge">Forge</SelectItem>
                  <SelectItem value="fabric">Fabric</SelectItem>
                  <SelectItem value="neoforge">NeoForge</SelectItem>
                  <SelectItem value="quilt">Quilt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {loaderVersions.length > 0 && (
            <div>
              <Label className="text-xs">Loader Version</Label>
              <Select value={form.mod_loader_version} onValueChange={v => setForm(f => ({ ...f, mod_loader_version: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select version" /></SelectTrigger>
                <SelectContent>
                  {loaderVersions.map(v => (
                    <SelectItem key={v} value={v}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <Switch checked={showSnapshots} onCheckedChange={setShowSnapshots} className="scale-75" />
              <span className="text-muted-foreground">Snapshots</span>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={showLegacy} onCheckedChange={setShowLegacy} className="scale-75" />
              <span className="text-muted-foreground">Legacy</span>
            </div>
          </div>

          <div>
            <Label className="text-xs">Description (optional)</Label>
            <Textarea
              placeholder="What's this instance for?"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="mt-1 h-16 resize-none"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name.trim() || saving}>
            {saving && <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />}
            {editInstance ? 'Save Changes' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
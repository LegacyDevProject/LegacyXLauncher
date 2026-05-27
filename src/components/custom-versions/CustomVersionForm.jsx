import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Plus, Trash2, CheckCircle2, AlertTriangle, Wrench } from 'lucide-react';
import { MINECRAFT_VERSIONS } from '@/lib/mockData';
import { useCustomVersions } from '@/lib/CustomVersionContext';
import { toast } from 'sonner';

const DEFAULT_JVM = '-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 -Xms2G -Xmx4G';
const ICONS = ['⚙️','🔧','🛠️','⚡','🌟','🔥','❄️','🎮','🏗️','🧪','🌿','💎','🗡️','🏰','🌍'];

function FieldLabel({ label, tooltip }) {
  return (
    <div className="flex items-center gap-1 mb-1">
      <Label className="text-xs">{label}</Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <HelpCircle className="w-3 h-3 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent side="right" className="max-w-[220px] text-xs">
            {tooltip}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default function CustomVersionForm({ open, onOpenChange, editVersion }) {
  const { addVersion, updateVersion, isNameUnique } = useCustomVersions();

  const getDefault = () => ({
    name: '',
    base_version: '1.20.1',
    mod_loader_override: 'none',
    mod_loader_version_str: '',
    custom_jar_path: '',
    custom_json_path: '',
    jvm_args: DEFAULT_JVM,
    game_args: '',
    java_path_override: '',
    env_vars: [],
    notes: '',
    icon: '⚙️',
  });

  const [form, setForm] = useState(editVersion || getDefault());
  const [nameError, setNameError] = useState('');
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    setForm(editVersion || getDefault());
    setNameError('');
    setTestResult(null);
  }, [open, editVersion]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addEnvVar = () => set('env_vars', [...form.env_vars, { key: '', value: '' }]);
  const removeEnvVar = (i) => set('env_vars', form.env_vars.filter((_, idx) => idx !== i));
  const updateEnvVar = (i, field, val) => {
    const updated = [...form.env_vars];
    updated[i] = { ...updated[i], [field]: val };
    set('env_vars', updated);
  };

  const validateName = (name) => {
    if (!name.trim()) { setNameError('Version name is required'); return false; }
    if (!isNameUnique(name.trim(), editVersion?.id)) { setNameError('Name already exists'); return false; }
    setNameError('');
    return true;
  };

  const handleTest = () => {
    const issues = [];
    const warnings = [];
    if (!form.name.trim()) issues.push('Version name is required');
    if (!isNameUnique(form.name.trim(), editVersion?.id)) issues.push('Name already exists');
    if (!form.custom_jar_path) warnings.push('No custom JAR set — will use base version jar');
    if (form.mod_loader_override !== 'none' && !form.mod_loader_version_str) warnings.push('Mod loader version not specified');
    setTestResult({ issues, warnings });
    if (issues.length === 0 && warnings.length === 0) {
      toast.success('Configuration looks good!');
    } else if (issues.length === 0) {
      warnings.forEach(w => toast.warning(w));
    } else {
      toast.error(`${issues.length} error(s) found`);
    }
  };

  const handleSave = () => {
    if (!validateName(form.name)) return;
    if (!form.custom_jar_path) {
      toast.warning('No custom JAR set — will use base version jar');
    }
    const data = { ...form, name: form.name.trim() };
    if (editVersion) {
      updateVersion(editVersion.id, data);
      toast.success(`Updated "${data.name}"`);
    } else {
      addVersion(data);
      toast.success(`Created custom version "${data.name}"`);
    }
    onOpenChange(false);
  };

  const allVersions = [
    ...MINECRAFT_VERSIONS.releases,
    ...MINECRAFT_VERSIONS.snapshots,
    ...MINECRAFT_VERSIONS.oldBeta,
    ...MINECRAFT_VERSIONS.oldAlpha,
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-primary" />
            {editVersion ? 'Edit Custom Version' : 'Create Custom Version'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-1">
          {/* Name + Icon */}
          <div className="flex gap-3 items-start">
            <div>
              <FieldLabel label="Icon" tooltip="Pick an emoji to visually identify this version" />
              <Select value={form.icon} onValueChange={v => set('icon', v)}>
                <SelectTrigger className="w-16 text-lg"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ICONS.map(e => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <FieldLabel label="Version Name *" tooltip="A unique display name for this custom version, e.g. 'MyModpack 1.0'" />
              <Input
                placeholder="MyModpack 1.0"
                value={form.name}
                onChange={e => { set('name', e.target.value); validateName(e.target.value); }}
                className={nameError ? 'border-destructive' : ''}
              />
              {nameError && <p className="text-[10px] text-destructive mt-1">{nameError}</p>}
            </div>
          </div>

          {/* Base Version + Mod Loader */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel label="Base Minecraft Version" tooltip="The official MC version this config is based on. Used as the jar source if no custom JAR is specified." />
              <Select value={form.base_version} onValueChange={v => set('base_version', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Releases</SelectLabel>
                    {MINECRAFT_VERSIONS.releases.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Snapshots</SelectLabel>
                    {MINECRAFT_VERSIONS.snapshots.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Old Beta</SelectLabel>
                    {MINECRAFT_VERSIONS.oldBeta.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Old Alpha</SelectLabel>
                    {MINECRAFT_VERSIONS.oldAlpha.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <FieldLabel label="Mod Loader Override" tooltip="Force a specific mod loader. 'None' uses the base version's default." />
              <Select value={form.mod_loader_override} onValueChange={v => set('mod_loader_override', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="forge">Forge</SelectItem>
                  <SelectItem value="fabric">Fabric</SelectItem>
                  <SelectItem value="neoforge">NeoForge</SelectItem>
                  <SelectItem value="quilt">Quilt</SelectItem>
                  <SelectItem value="liteloader">LiteLoader</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {form.mod_loader_override !== 'none' && (
            <div>
              <FieldLabel label="Mod Loader Version" tooltip="Exact version string, e.g. 'forge-43.3.0' or '0.14.25+1.20.1'" />
              <Input
                placeholder="e.g. forge-43.3.0"
                value={form.mod_loader_version_str}
                onChange={e => set('mod_loader_version_str', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          )}

          <Separator />

          {/* Paths */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel label="Custom JAR Path (optional)" tooltip="Path to a custom .jar game file. Leave blank to use the base version's jar." />
              <Input
                placeholder="/path/to/custom-game.jar"
                value={form.custom_jar_path}
                onChange={e => set('custom_jar_path', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <FieldLabel label="Custom JSON Path (optional)" tooltip="Path to a custom version manifest .json to override the version metadata." />
              <Input
                placeholder="/path/to/version.json"
                value={form.custom_json_path}
                onChange={e => set('custom_json_path', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div>
              <FieldLabel label="Java Path Override (optional)" tooltip="Specific java executable for this version. Leave blank to use the global Java setting." />
              <Input
                placeholder="/usr/lib/jvm/java-17/bin/java"
                value={form.java_path_override}
                onChange={e => set('java_path_override', e.target.value)}
                className="font-mono text-xs"
              />
            </div>
          </div>

          <Separator />

          {/* JVM + Game Args */}
          <div className="grid grid-cols-1 gap-3">
            <div>
              <FieldLabel label="JVM Arguments" tooltip="Arguments passed to the Java process before the game jar, e.g. memory settings, GC flags." />
              <Textarea
                value={form.jvm_args}
                onChange={e => set('jvm_args', e.target.value)}
                className="font-mono text-xs h-20 resize-none"
              />
            </div>
            <div>
              <FieldLabel label="Game Arguments (optional)" tooltip="Extra arguments passed directly to the Minecraft game process." />
              <Textarea
                placeholder="--demo --width 1280 --height 720"
                value={form.game_args}
                onChange={e => set('game_args', e.target.value)}
                className="font-mono text-xs h-14 resize-none"
              />
            </div>
          </div>

          <Separator />

          {/* Env Vars */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <FieldLabel label="Environment Variables" tooltip="KEY=VALUE pairs injected into the game process environment." />
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addEnvVar}>
                <Plus className="w-3 h-3 mr-1" /> Add
              </Button>
            </div>
            {form.env_vars.length === 0 && (
              <p className="text-xs text-muted-foreground">No environment variables set.</p>
            )}
            <div className="space-y-2">
              {form.env_vars.map((ev, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <Input
                    placeholder="KEY"
                    value={ev.key}
                    onChange={e => updateEnvVar(i, 'key', e.target.value)}
                    className="font-mono text-xs flex-1"
                  />
                  <span className="text-muted-foreground text-sm">=</span>
                  <Input
                    placeholder="VALUE"
                    value={ev.value}
                    onChange={e => updateEnvVar(i, 'value', e.target.value)}
                    className="font-mono text-xs flex-1"
                  />
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-destructive hover:text-destructive" onClick={() => removeEnvVar(i)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div>
            <FieldLabel label="Notes / Description (optional)" tooltip="Freeform notes about this configuration for your reference." />
            <Textarea
              placeholder="e.g. Used for the ATM9 modpack, requires Java 17..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              className="text-xs h-16 resize-none"
            />
          </div>

          {/* Test Result */}
          {testResult && (
            <div className="space-y-1.5">
              {testResult.issues.map((issue, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 rounded-md px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {issue}
                </div>
              ))}
              {testResult.warnings.map((warn, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-warning bg-warning/10 rounded-md px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {warn}
                </div>
              ))}
              {testResult.issues.length === 0 && testResult.warnings.length === 0 && (
                <div className="flex items-center gap-2 text-xs text-success bg-success/10 rounded-md px-3 py-2">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Configuration looks good!
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" size="sm" onClick={handleTest}>
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Test Config
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={!form.name.trim()}>
            {editVersion ? 'Save Changes' : 'Create Version'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
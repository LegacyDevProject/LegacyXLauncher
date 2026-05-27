import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useSettings } from '@/lib/SettingsContext';
import AccountManager from '@/components/settings/AccountManager';
import ThemeSelector from '@/components/settings/ThemeSelector';
import CustomVersionManager from '@/components/custom-versions/CustomVersionManager';

export default function Settings() {
  const { settings, updateSetting } = useSettings();

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure your launcher</p>
      </div>

      <div className="space-y-8 max-w-2xl">
        {/* Accounts */}
        <AccountManager />

        <Separator />

        {/* Theme */}
        <ThemeSelector />

        <Separator />

        {/* Custom Versions */}
        <CustomVersionManager />

        <Separator />

        {/* Java Settings */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Java Settings</h3>
          <Card className="p-4 space-y-5">
            <div>
              <Label className="text-xs">Java Path</Label>
              <Input
                value={settings.javaPath}
                onChange={e => updateSetting('javaPath', e.target.value)}
                placeholder="auto"
                className="mt-1 font-mono text-xs"
              />
              <p className="text-[10px] text-muted-foreground mt-1">Set to "auto" for automatic detection</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Minimum RAM</Label>
                <span className="text-xs font-mono text-muted-foreground">{settings.minRam} GB</span>
              </div>
              <Slider
                value={[settings.minRam]}
                onValueChange={([v]) => updateSetting('minRam', v)}
                min={1}
                max={16}
                step={1}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-xs">Maximum RAM</Label>
                <span className="text-xs font-mono text-muted-foreground">{settings.maxRam} GB</span>
              </div>
              <Slider
                value={[settings.maxRam]}
                onValueChange={([v]) => updateSetting('maxRam', v)}
                min={1}
                max={32}
                step={1}
              />
            </div>

            <div>
              <Label className="text-xs">JVM Arguments</Label>
              <Input
                value={settings.jvmArgs}
                onChange={e => updateSetting('jvmArgs', e.target.value)}
                className="mt-1 font-mono text-xs"
              />
            </div>
          </Card>
        </div>

        <Separator />

        {/* Launcher Behavior */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Launcher Behavior</h3>
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Close launcher on game start</p>
                <p className="text-[10px] text-muted-foreground">Hide the launcher window when Minecraft starts</p>
              </div>
              <Switch
                checked={settings.closeOnLaunch}
                onCheckedChange={v => updateSetting('closeOnLaunch', v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Notifications</p>
                <p className="text-[10px] text-muted-foreground">Show notifications for downloads and updates</p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={v => updateSetting('notifications', v)}
              />
            </div>
          </Card>
        </div>

        <Separator />

        {/* Downloads */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Downloads</h3>
          <Card className="p-4">
            <Label className="text-xs">Game Files Directory</Label>
            <Input
              value={settings.gameDir}
              onChange={e => updateSetting('gameDir', e.target.value)}
              className="mt-1 font-mono text-xs"
            />
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
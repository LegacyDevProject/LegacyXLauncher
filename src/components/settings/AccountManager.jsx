import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Plus, Trash2, Crown, WifiOff, User, Check } from 'lucide-react';
import { useAccount } from '@/lib/AccountContext';
import { toast } from 'sonner';

export default function AccountManager() {
  const { accounts, activeAccount, addAccount, removeAccount, switchAccount } = useAccount();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [offlineUsername, setOfflineUsername] = useState('');

  const handleAddMicrosoft = () => {
    const acc = addAccount({
      username: 'Steve_Premium',
      type: 'premium',
      email: 'steve@outlook.com',
    });
    toast.success(`Microsoft account "${acc.username}" added!`);
    setDialogOpen(false);
  };

  const handleAddOffline = () => {
    if (!offlineUsername.trim()) return;
    const acc = addAccount({
      username: offlineUsername.trim(),
      type: 'offline',
    });
    toast.success(`Offline account "${acc.username}" added!`);
    setOfflineUsername('');
    setDialogOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">Accounts</h3>
        <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Account
        </Button>
      </div>

      {accounts.length === 0 ? (
        <Card className="p-6 text-center border-dashed">
          <User className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No accounts added yet</p>
          <Button variant="link" size="sm" onClick={() => setDialogOpen(true)}>Add your first account</Button>
        </Card>
      ) : (
        <div className="space-y-2">
          {accounts.map(acc => (
            <Card key={acc.id} className="p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{acc.username[0].toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{acc.username}</p>
                    {acc.type === 'premium' ? (
                      <Badge className="bg-warning/15 text-warning border-0 text-[9px] px-1.5">
                        <Crown className="w-2.5 h-2.5 mr-0.5" />Premium
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[9px] px-1.5 text-muted-foreground">
                        <WifiOff className="w-2.5 h-2.5 mr-0.5" />Offline
                      </Badge>
                    )}
                  </div>
                  {acc.email && <p className="text-[10px] text-muted-foreground">{acc.email}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {acc.id === activeAccount?.id ? (
                    <Badge className="bg-success/15 text-success border-0 text-[9px]">
                      <Check className="w-2.5 h-2.5 mr-0.5" />Active
                    </Badge>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => switchAccount(acc.id)}>
                      Switch
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => { removeAccount(acc.id); toast.info('Account removed'); }}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
            <DialogTitle>Add Account</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="microsoft">
            <TabsList className="w-full">
              <TabsTrigger value="microsoft" className="flex-1">Microsoft</TabsTrigger>
              <TabsTrigger value="offline" className="flex-1">Offline</TabsTrigger>
            </TabsList>
            <TabsContent value="microsoft" className="mt-4">
              <p className="text-xs text-muted-foreground mb-4">
                Sign in with your Microsoft account to play on premium servers.
              </p>
              <Button className="w-full" onClick={handleAddMicrosoft}>
                <Crown className="w-4 h-4 mr-2" /> Sign in with Microsoft
              </Button>
            </TabsContent>
            <TabsContent value="offline" className="mt-4 space-y-3">
              <p className="text-xs text-muted-foreground">
                Enter any username to play in offline/cracked mode.
              </p>
              <div>
                <Label className="text-xs">Username</Label>
                <Input
                  placeholder="Steve"
                  value={offlineUsername}
                  onChange={e => setOfflineUsername(e.target.value)}
                  className="mt-1"
                  maxLength={16}
                />
              </div>
              <Button className="w-full" onClick={handleAddOffline} disabled={!offlineUsername.trim()}>
                Add Offline Account
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
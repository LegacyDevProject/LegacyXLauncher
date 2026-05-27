import React, { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccount } from '@/lib/AccountContext';
import { toast } from 'sonner';

export default function PlayButton({ instanceName }) {
  const [launching, setLaunching] = useState(false);
  const { activeAccount } = useAccount();

  const handlePlay = () => {
    if (!activeAccount) {
      toast.error('No account selected. Add an account in Settings first.');
      return;
    }
    setLaunching(true);
    toast.success(`Launching ${instanceName || 'Minecraft'}...`, {
      description: `Playing as ${activeAccount.username} (${activeAccount.type})`,
    });
    setTimeout(() => setLaunching(false), 3000);
  };

  return (
    <Button
      size="lg"
      onClick={handlePlay}
      disabled={launching}
      className="h-14 px-10 text-lg font-bold rounded-xl animate-pulse-glow hover:scale-[1.02] transition-transform"
    >
      {launching ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Launching...
        </>
      ) : (
        <>
          <Play className="w-5 h-5 mr-2 fill-current" />
          PLAY
        </>
      )}
    </Button>
  );
}
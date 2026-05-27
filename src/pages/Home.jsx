const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React from 'react';
import { useQuery } from '@tanstack/react-query';

import { motion } from 'framer-motion';
import NewsBanner from '@/components/home/NewsBanner';
import PlayButton from '@/components/home/PlayButton';
import RecentInstances from '@/components/home/RecentInstances';
import ServerStatusWidget from '@/components/home/ServerStatusWidget';
import { useAccount } from '@/lib/AccountContext';

export default function Home() {
  const { activeAccount } = useAccount();

  const { data: instances, isLoading: loadingInstances } = useQuery({
    queryKey: ['instances'],
    queryFn: () => db.entities.Instance.list('-last_played'),
    initialData: [],
  });

  const { data: servers, isLoading: loadingServers } = useQuery({
    queryKey: ['servers'],
    queryFn: () => db.entities.ServerEntry.list(),
    initialData: [],
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <NewsBanner />

      {/* Quick Launch */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card rounded-xl p-5 border border-border">
        <div>
          <h2 className="text-lg font-bold">
            {activeAccount ? `Welcome back, ${activeAccount.username}` : 'Welcome to LegacyX'}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {instances.length > 0
              ? `You have ${instances.length} instance${instances.length !== 1 ? 's' : ''} ready to play`
              : 'Create an instance to get started'}
          </p>
        </div>
        <PlayButton instanceName={instances[0]?.name} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentInstances instances={instances} isLoading={loadingInstances} />
        </div>
        <div>
          <ServerStatusWidget servers={servers} isLoading={loadingServers} />
        </div>
      </div>
    </motion.div>
  );
}
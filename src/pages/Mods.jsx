import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModCard from '@/components/mods/ModCard';
import { MOCK_MODS } from '@/lib/mockData';

const CATEGORIES = ['all', 'optimization', 'rendering', 'utility', 'technology', 'library', 'worldgen'];

export default function Mods() {
  const [search, setSearch] = useState('');
  const [source, setSource] = useState('all');
  const [category, setCategory] = useState('all');

  const filtered = useMemo(() => {
    return MOCK_MODS.filter(mod => {
      const matchSearch = mod.name.toLowerCase().includes(search.toLowerCase()) ||
        mod.author.toLowerCase().includes(search.toLowerCase());
      const matchSource = source === 'all' || mod.source === source;
      const matchCategory = category === 'all' || mod.category === category;
      return matchSearch && matchSource && matchCategory;
    });
  }, [search, source, category]);

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mods</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Browse and install mods for your instances</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search mods..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Tabs value={source} onValueChange={setSource}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="modrinth">Modrinth</TabsTrigger>
            <TabsTrigger value="curseforge">CurseForge</TabsTrigger>
          </TabsList>
        </Tabs>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-40">
            <Filter className="w-3.5 h-3.5 mr-1.5" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(c => (
              <SelectItem key={c} value={c} className="capitalize">{c === 'all' ? 'All Categories' : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(mod => (
          <ModCard key={mod.id} mod={mod} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-sm">No mods found matching your search.</p>
        </div>
      )}
    </motion.div>
  );
}
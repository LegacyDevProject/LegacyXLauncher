import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOCK_NEWS } from '@/lib/mockData';

export default function NewsBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % MOCK_NEWS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const news = MOCK_NEWS[current];

  return (
    <div className="relative rounded-xl overflow-hidden h-[220px] md:h-[260px] group">
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7">
        <Badge className="bg-primary/90 text-primary-foreground mb-2 text-[10px]">{news.tag}</Badge>
        <h2 className="text-white text-xl md:text-2xl font-bold leading-tight">{news.title}</h2>
        <p className="text-white/70 text-sm mt-1.5 max-w-lg">{news.description}</p>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white"
          onClick={() => setCurrent(prev => (prev - 1 + MOCK_NEWS.length) % MOCK_NEWS.length)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 bg-black/40 hover:bg-black/60 text-white"
          onClick={() => setCurrent(prev => (prev + 1) % MOCK_NEWS.length)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="absolute bottom-2 right-4 flex gap-1.5">
        {MOCK_NEWS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all ${i === current ? 'bg-white w-5' : 'bg-white/40'}`}
          />
        ))}
      </div>
    </div>
  );
}
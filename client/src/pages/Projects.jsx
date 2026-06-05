import { useState, useEffect } from 'react';
import { Filter, Search } from 'lucide-react';
import { SharpBolt } from '../components/SharpBolt';
import { motion } from 'framer-motion';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetch('http://localhost:3000/api/projects')
      .then(res => res.json())
      .then(data => setProjects(data))
      .catch(err => console.error(err));
  }, []);

  const filteredProjects = filter === 'ALL' 
    ? projects 
    : projects.filter(p => p.cat === filter);

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-2 uppercase flex items-center gap-4">
            <span className="w-8 h-1 bg-secondary inline-block"></span>
            PROJECT REGISTRY
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
            Explore our portfolio of cutting-edge hardware and software deployments. Each project represents a unique solution to a complex engineering challenge.
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-outline-variant/30">
        <div className="flex flex-wrap gap-2">
          {['ALL', 'IoT', 'Hardware', 'Software', 'AI'].map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`font-label-caps text-xs px-6 py-2 rounded-full border transition-all ${filter === cat ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_10px_rgba(255,198,64,0.3)]' : 'border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-emerald-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="input-field pl-10 pr-4 py-2 rounded-full w-full md:w-64 font-body-md text-sm"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProjects.map((p, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={p.id} 
            className="glass-panel group rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`font-code-sm text-[10px] px-3 py-1 rounded border ${p.status === 'ACTIVE' ? 'border-secondary text-secondary bg-secondary/10' : p.status === 'BETA' ? 'border-tertiary text-emerald-500 bg-emerald-500/10' : 'border-outline text-outline bg-outline/10'}`}>
                {p.status}
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 text-on-surface">
                {/* Dynamically rendering lucide icon by name in a real app would need a map, using Bolt as fallback */}
                <SharpBolt className="w-5 h-5 text-on-surface-variant group-hover:text-emerald-500 transition-colors" />
              </div>
            </div>
            
            <h2 className="font-headline-md text-2xl text-on-surface mb-2 relative z-10 group-hover:text-secondary transition-colors">{p.title}</h2>
            <p className="font-body-md text-on-surface-variant mb-8 relative z-10">{p.subtitle}</p>
            
            <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 relative z-10">
              <span className="font-code-sm text-xs text-on-surface-variant uppercase tracking-widest">{p.cat}</span>
              <button className="text-secondary font-label-caps text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                VIEW DETAILS <SharpBolt className="w-3 h-3 text-secondary" />
              </button>
            </div>
          </motion.div>
        ))}

        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-on-surface-variant">
            <Filter className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-headline-md text-xl text-on-surface">No projects found</p>
            <p className="font-body-md text-sm mt-2">Try selecting a different category.</p>
          </div>
        )}
      </div>

    </div>
  );
}

import { useState, useEffect } from 'react';
import { Filter, Search, RefreshCcw, Cpu, Code, Bot, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

const FALLBACK_PROJECTS = [
  { id: 1, title: 'Smart Irrigation System', subtitle: 'Automated soil-moisture driven watering with ESP32 + LoRa mesh.', cat: 'IoT', status: 'ACTIVE' },
  { id: 2, title: 'BLE Asset Tracker', subtitle: 'Real-time indoor asset tracking via Bluetooth Low Energy beacons.', cat: 'Hardware', status: 'ACTIVE' },
  { id: 3, title: 'Hospital Management Portal', subtitle: 'Full-stack web app for ward management, billing, and patient records.', cat: 'Software', status: 'ACTIVE' },
  { id: 4, title: 'Vision-Based Defect Detector', subtitle: 'Edge AI model running on Nvidia Jetson for QA on production lines.', cat: 'AI', status: 'BETA' },
  { id: 5, title: 'Weather Station Array', subtitle: 'Multi-node atmospheric sensor network with InfluxDB + Grafana dashboards.', cat: 'IoT', status: 'ACTIVE' },
  { id: 6, title: 'Custom PCB Motor Driver', subtitle: 'High-current H-bridge motor driver PCB for robotics competitions.', cat: 'Hardware', status: 'ACTIVE' },
];

const CAT_ICONS = {
  IoT: Wifi,
  Hardware: Cpu,
  Software: Code,
  AI: Bot,
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProjects = () => {
    setLoading(true);
    setError(false);
    fetch('/api/projects')
      .then(res => {
        if (!res.ok) throw new Error('Non-2xx');
        return res.json();
      })
      .then(data => {
        setProjects(data.length ? data : FALLBACK_PROJECTS);
        setLoading(false);
      })
      .catch(() => {
        setProjects(FALLBACK_PROJECTS);
        setError(true);
        setLoading(false);
      });
  };

  useEffect(() => { fetchProjects(); }, []);

  const filteredProjects = projects.filter(p => {
    const matchesCat = filter === 'ALL' || p.cat === filter;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.subtitle?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-2 uppercase flex items-center gap-4">
            <span className="w-8 h-1 bg-secondary inline-block"></span>
            PROJECT REGISTRY
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
            Explore our portfolio of cutting-edge hardware and software deployments.
          </p>
        </div>
        {error && (
          <div className="flex items-center gap-2 text-on-surface-variant text-sm font-code-sm bg-surface-container-high px-4 py-2 rounded-full border border-outline-variant/30">
            <span className="w-2 h-2 rounded-full bg-secondary/60 animate-pulse"></span>
            Showing sample projects
            <button onClick={fetchProjects} className="ml-2 text-secondary hover:text-emerald-400 transition-colors flex items-center gap-1">
              <RefreshCcw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}
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
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 pr-4 py-2 rounded-full w-full md:w-64 font-body-md text-sm bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary/50 transition-colors"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* Loading skeleton */}
        {loading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="glass-panel rounded-xl p-6 animate-pulse">
            <div className="flex justify-between items-start mb-6">
              <div className="h-5 w-16 bg-outline-variant/30 rounded-full"></div>
              <div className="w-10 h-10 rounded-full bg-outline-variant/20"></div>
            </div>
            <div className="h-7 bg-outline-variant/30 rounded mb-3 w-3/4"></div>
            <div className="h-4 bg-outline-variant/20 rounded mb-2 w-full"></div>
            <div className="h-4 bg-outline-variant/20 rounded mb-8 w-2/3"></div>
            <div className="flex justify-between pt-4 border-t border-outline-variant/20">
              <div className="h-3 w-12 bg-outline-variant/30 rounded"></div>
              <div className="h-3 w-20 bg-outline-variant/30 rounded"></div>
            </div>
          </div>
        ))}

        {/* Project cards */}
        {!loading && filteredProjects.map((p, i) => {
          const Icon = CAT_ICONS[p.cat] || Cpu;
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              key={p.id}
              className="glass-panel group rounded-xl p-6 relative overflow-hidden hover:border-secondary/30 transition-all duration-300 cursor-pointer"
            >
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>

              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className={`font-code-sm text-[10px] px-3 py-1 rounded border ${p.status === 'ACTIVE' ? 'border-secondary text-secondary bg-secondary/10' : p.status === 'BETA' ? 'border-tertiary text-emerald-500 bg-emerald-500/10' : 'border-outline text-outline bg-outline/10'}`}>
                  {p.status}
                </div>
                <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center border border-outline-variant/30 group-hover:border-tertiary/40 transition-colors">
                  <Icon className="w-5 h-5 text-on-surface-variant group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>

              <h2 className="font-headline-md text-xl text-on-surface mb-2 relative z-10 group-hover:text-secondary transition-colors">{p.title}</h2>
              <p className="font-body-md text-sm text-on-surface-variant mb-8 relative z-10 leading-relaxed">{p.subtitle}</p>

              <div className="flex items-center justify-between border-t border-outline-variant/30 pt-4 relative z-10">
                <span className="font-code-sm text-xs text-on-surface-variant uppercase tracking-widest">{p.cat}</span>
                <button className="text-secondary font-label-caps text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                  VIEW DETAILS <Icon className="w-3 h-3 text-secondary" />
                </button>
              </div>
            </motion.div>
          );
        })}

        {/* Empty state */}
        {!loading && filteredProjects.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-on-surface-variant">
            <Filter className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-headline-md text-xl text-on-surface">No projects found</p>
            <p className="font-body-md text-sm mt-2">Try a different category or search term.</p>
          </div>
        )}
      </div>

    </div>
  );
}

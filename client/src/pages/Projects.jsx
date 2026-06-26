import { useState, useEffect } from 'react';
import { Filter, Search, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PROJECTS } from '../data/projects';
import ProjectVisual from '../components/ProjectVisual';
import { waLink, trackWhatsApp, messages } from '../config/whatsapp';

const CATS = ['ALL', 'IoT', 'Hardware', 'Software', 'AI'];

const statusStyle = (status) =>
  status === 'ACTIVE'
    ? 'border-secondary text-secondary bg-secondary/10'
    : status === 'BETA'
    ? 'border-tertiary text-sky-400 bg-sky-400/10'
    : 'border-outline text-outline bg-outline/10';

// ── Detail modal with context-aware WhatsApp CTA ──────────────
function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  const waHref = waLink(messages.project(project.title, project.cat));

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[200] flex items-end md:items-center justify-center p-0 md:p-6"
      style={{ background: 'rgba(3,5,12,0.75)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        role="dialog" aria-modal="true" aria-label={`${project.title} details`}
        onClick={(e) => e.stopPropagation()}
        initial={{ y: '100%', scale: 0.95, opacity: 0 }} 
        animate={{ y: 0, scale: 1, opacity: 1 }} 
        exit={{ y: '100%', scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="glass-panel relative w-full md:max-w-lg rounded-t-2xl md:rounded-2xl overflow-hidden"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Hero visual */}
        <div className="relative group">
          <ProjectVisual project={project} height={200} />
          <button onClick={onClose} aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(3,5,12,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}>
            <X className="w-4 h-4 text-white" />
          </button>
          <div className="absolute bottom-4 left-5 right-5">
            <span className={`font-code-sm text-[10px] px-2 py-0.5 rounded border ${statusStyle(project.status)}`}>{project.status}</span>
            <h2 className="font-headline-md text-2xl text-white mt-2 drop-shadow-lg">{project.title}</h2>
          </div>
        </div>

        <div className="p-6 md:p-7">
          <p className="font-body-md text-on-surface-variant leading-relaxed mb-6">{project.subtitle}</p>

          {project.features?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-code-sm text-xs text-secondary uppercase tracking-widest mb-3">Key Features</h3>
              <ul className="space-y-2">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 font-body-md text-sm text-on-surface">
                    <CheckCircle2 className="w-4 h-4 text-secondary shrink-0 mt-0.5" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.stack?.length > 0 && (
            <div className="mb-7">
              <h3 className="font-code-sm text-xs text-tertiary uppercase tracking-widest mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((t) => (
                  <span key={t} className="px-3 py-1 rounded text-xs font-code-sm border border-tertiary/20 bg-sky-400/10 text-sky-400">{t}</span>
                ))}
              </div>
            </div>
          )}

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackWhatsApp(`project:${project.title}`)}
            className="w-full py-3.5 font-label-caps text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}
          >
            Build something like this <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Projects() {
  const [filter, setFilter]     = useState('ALL');
  const [search, setSearch]     = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = PROJECTS.filter(p => {
    const matchesCat = filter === 'ALL' || p.cat === filter;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.subtitle?.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">

      {/* Header */}
      <div className="mb-10">
        <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-2 uppercase flex items-center gap-4">
          <span className="w-8 h-1 bg-secondary inline-block"></span>
          PROJECT REGISTRY
        </h1>
        <p className="font-body-lg text-lg text-on-surface-variant max-w-2xl">
          A glimpse of what we engineer. See something you like? Tap it — and let's build yours.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 pb-6 border-b border-outline-variant/30">
        <div className="flex flex-wrap gap-2">
          {CATS.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              className={`font-label-caps text-xs px-6 py-2 rounded-full border transition-all ${filter === cat ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_10px_rgba(255,198,64,0.3)]' : 'border-outline-variant text-on-surface-variant hover:border-tertiary hover:text-sky-400'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
          <input type="text" placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)}
            className="input-field pl-10 pr-4 py-2 rounded-full w-full md:w-64 font-body-md text-sm bg-surface-container-high border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary/50 transition-colors" />
        </div>
      </div>

      {/* Cinematic grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: (i % 3) * 0.1, duration: 0.6, type: "spring", stiffness: 100, damping: 20 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelected(p)}
            className="group glass-panel rounded-2xl overflow-hidden text-left relative cursor-pointer"
            style={{ borderTop: `2px solid ${p.accent}` }}
          >
            <ProjectVisual project={p} height={190} className="rounded-t-2xl" />

            {/* Floating status + cat */}
            <div className="absolute top-3 left-3 flex gap-2">
              <span className={`font-code-sm text-[10px] px-2 py-0.5 rounded border backdrop-blur-sm ${statusStyle(p.status)}`}>{p.status}</span>
            </div>

            <div className="p-5">
              <h2 className="font-headline-md text-xl text-on-surface mb-1.5 group-hover:text-secondary transition-colors">{p.title}</h2>
              <p className="font-body-md text-sm text-on-surface-variant mb-4 leading-relaxed">{p.subtitle}</p>
              <div className="flex items-center justify-between border-t border-outline-variant/20 pt-3">
                <span className="font-code-sm text-xs text-on-surface-variant uppercase tracking-widest">{p.cat}</span>
                <span className="text-secondary font-label-caps text-xs flex items-center gap-1 group-hover:gap-2 transition-all">
                  VIEW <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </motion.button>
        ))}

        {filtered.length === 0 && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="col-span-full py-20 flex flex-col items-center justify-center text-on-surface-variant">
            <Filter className="w-12 h-12 mb-4 opacity-50" />
            <p className="font-headline-md text-xl text-on-surface">No projects found</p>
            <button onClick={() => { setFilter('ALL'); setSearch(''); }}
              className="mt-5 text-secondary font-label-caps text-xs border border-secondary/30 px-5 py-2 rounded-full hover:bg-secondary/10 transition-colors">
              CLEAR FILTERS
            </button>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="glass-panel glass-panel-glow rounded-2xl p-8 md:p-10 mt-16 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(229,169,60,0.08) 0%, transparent 60%)' }} />
        <h2 className="font-headline-lg text-on-surface mb-3 relative z-10" style={{ fontSize: 'clamp(22px,3vw,32px)' }}>
          Don't see your exact idea?
        </h2>
        <p className="font-body-md text-on-surface-variant mb-6 max-w-lg mx-auto relative z-10">
          We build custom. Tell us what's in your head and we'll make it real.
        </p>
        <a
          href={waLink(messages.generic)}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackWhatsApp('projects-bottom-cta')}
          className="relative z-10 inline-flex items-center gap-2 font-label-caps text-xs uppercase tracking-widest px-8 py-4"
          style={{ borderRadius: 12, color: '#fff', background: 'linear-gradient(135deg, #25d366 0%, #128c7e 100%)', boxShadow: '0 4px 18px rgba(37,211,102,0.4)' }}
        >
          Start a custom project <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>

      <AnimatePresence>
        {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

/**
 * ProjectVisual
 * Renders a project's hero image, or a generated gradient-mesh + icon visual
 * when no image is available — so every card looks rich and intentional.
 */
import { Cpu, Code, Bot, Wifi } from 'lucide-react';

const CAT_ICON = { IoT: Wifi, Hardware: Cpu, Software: Code, AI: Bot };

export default function ProjectVisual({ project, className = '', height = 200 }) {
  const Icon = CAT_ICON[project.cat] || Cpu;
  const accent = project.accent || '#00d2ff';

  if (project.image) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={{ height }}>
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient scrim for text legibility + brand tint */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, transparent 30%, rgba(7,12,30,0.85) 100%)` }} />
        <div className="absolute inset-0 opacity-30" style={{ background: `radial-gradient(circle at 70% 20%, ${accent}33 0%, transparent 60%)` }} />
      </div>
    );
  }

  // Generated visual
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, #0b132b 0%, #03050c 100%)' }} />
      {/* Mesh orbs */}
      <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full" style={{ background: `radial-gradient(circle, ${accent}33 0%, transparent 70%)`, filter: 'blur(20px)' }} />
      <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full" style={{ background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`, filter: 'blur(24px)' }} />
      {/* Circuit grid */}
      <div className="absolute inset-0 opacity-[0.07]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 8 h12 v8 h8 v12' stroke='%23ffffff' fill='none' stroke-width='0.5'/%3E%3Ccircle cx='20' cy='16' r='1.5' fill='%23ffffff'/%3E%3C/svg%3E")`,
        backgroundSize: '40px 40px',
      }} />
      {/* Big centered icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-transform duration-700 group-hover:scale-110"
          style={{ background: `${accent}1a`, border: `1px solid ${accent}55`, boxShadow: `0 0 30px ${accent}33` }}>
          <Icon className="w-9 h-9" style={{ color: accent }} />
        </div>
      </div>
    </div>
  );
}

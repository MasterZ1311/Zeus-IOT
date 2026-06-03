import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Signal, Battery, Activity, Cpu, Cloud, CloudSync, Router, Edit, Trash2, Plus } from 'lucide-react';
import { SharpBolt } from '../components/SharpBolt';

export default function Admin() {
  const [telemetry, setTelemetry] = useState({ signal: -40, batt: 3.7, uptime: 99.5, activeNodes: 24 });
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('zeus_admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Connect to WebSocket Server for Telemetry
    const socket = io('http://localhost:3000');
    socket.on('telemetry_update', (data) => {
      setTelemetry(data);
    });

    fetchProjects();

    return () => socket.disconnect();
  }, [token, navigate]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects', error);
    }
  };

  const deleteProject = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/projects/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) fetchProjects();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full flex flex-col gap-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg-mobile md:text-5xl font-bold text-on-surface tracking-tight uppercase">PROJECT CONSOLE</h1>
          <p className="font-body-md text-on-surface-variant mt-1">Manage active deployments and nodes.</p>
        </div>
        <button className="btn-thunderbolt font-label-caps text-xs px-6 py-3 rounded-sm flex items-center justify-center gap-2 w-full md:w-auto">
          <Plus className="w-5 h-5" />
          CREATE NEW PROJECT
        </button>
      </div>

      {/* TELEMETRY DASHBOARD */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryCard title="Signal Strength" value={`${telemetry.signal}`} unit="dBm" icon={<Signal className="text-tertiary" />} pulse />
        <TelemetryCard title="Battery Voltage" value={`${telemetry.batt}`} unit="V" icon={<Battery className="text-secondary" />} />
        <TelemetryCard title="System Uptime" value={`${telemetry.uptime}`} unit="%" icon={<Activity className="text-tertiary" />} />
        <TelemetryCard title="Active Nodes" value={`${telemetry.activeNodes}`} unit="" icon={<Cpu className="text-tertiary" />} valueColor="text-secondary" />
      </div>

      <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-6 justify-around items-center">
        <GatewayStatus icon={<Cloud />} name="AWS IoT Core" nodes={12} color="#4ade80" />
        <div className="hidden md:block w-px h-10 bg-outline-variant/30"></div>
        <GatewayStatus icon={<CloudSync />} name="Azure IoT Hub" nodes={8} color="#f59e0b" />
        <div className="hidden md:block w-px h-10 bg-outline-variant/30"></div>
        <GatewayStatus icon={<Router />} name="Local Gateway" nodes={telemetry.activeNodes - 20} color="#4ade80" />
      </div>

      {/* PROJECT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        {projects.map(p => (
          <div key={p.id} className={`glass-panel glass-panel-glow rounded-xl p-4 flex flex-col gap-4 relative group hover:bg-surface-container-highest/40 transition-colors ${p.status === 'ACTIVE' ? 'border-t-2 border-t-secondary' : p.status === 'BETA' ? 'border-t-2 border-t-tertiary' : 'border-t-2 border-t-outline opacity-70'}`}>
            <div className="flex justify-between items-start">
              <div>
                <div className={`font-code-sm text-[10px] px-2 py-0.5 rounded-sm inline-block mb-2 border ${p.status === 'ACTIVE' ? 'border-secondary text-secondary bg-secondary/10' : p.status === 'BETA' ? 'border-tertiary text-tertiary bg-tertiary/10' : 'border-outline text-outline bg-outline/10'}`}>
                  {p.status}
                </div>
                <h2 className="font-headline-md text-xl text-on-surface">{p.title}</h2>
                <p className="font-body-md text-on-surface-variant text-sm mt-1">{p.subtitle}</p>
              </div>
              <SharpBolt className="text-outline opacity-50 w-8 h-8" />
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-surface-container-low p-2 rounded-lg border border-outline-variant/30">
                <span className="block text-on-surface-variant font-label-caps mb-1 uppercase text-[10px]">Nodes</span>
                <span className="font-code-sm text-tertiary text-xs">{p.nodesOnline} / {p.nodesTotal}</span>
              </div>
              <div className="bg-surface-container-low p-2 rounded-lg border border-outline-variant/30">
                <span className="block text-on-surface-variant font-label-caps mb-1 uppercase text-[10px]">{p.status === 'ACTIVE' ? 'Uptime' : 'Status'}</span>
                <span className="font-code-sm text-on-surface text-xs">{p.status === 'ACTIVE' ? '99.9%' : 'Standby'}</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-outline-variant/20">
              <button className="btn-ghost-static text-on-surface p-2 rounded-lg flex items-center justify-center hover:bg-tertiary/10 text-tertiary border border-tertiary/30">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => deleteProject(p.id)} className="text-error border border-error/30 hover:bg-error/10 p-2 rounded-lg flex items-center justify-center transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TelemetryCard({ title, value, unit, icon, pulse, valueColor = "text-on-surface" }) {
  return (
    <div className="glass-panel rounded-xl p-4 flex flex-col gap-2 relative">
      <div className="flex justify-between items-center">
        <span className="font-code-sm text-[10px] text-on-surface-variant uppercase tracking-widest">{title}</span>
        {pulse && <div className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></div>}
      </div>
      <div className="flex items-end justify-between">
        <span className={`font-headline-md text-2xl ${valueColor}`}>{value} <span className="text-sm text-on-surface-variant font-body-md">{unit}</span></span>
        {icon}
      </div>
    </div>
  );
}

function GatewayStatus({ icon, name, nodes, color }) {
  return (
    <div className="flex items-center gap-3 w-full md:w-auto">
      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
        {icon}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }}></div>
          <span className="font-code-sm text-sm text-on-surface">{name}</span>
        </div>
        <span className="font-body-md text-xs text-on-surface-variant">{nodes} nodes online</span>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    contact_no: '',
    institution: '',
    deadline: '',
    description: '',
    perf_expectation: ''
  });
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ name: '', contact_no: '', institution: '', deadline: '', description: '', perf_expectation: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* INFO */}
        <div>
          <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-6 uppercase flex items-center gap-4">
            <span className="w-8 h-1 bg-emerald-500 inline-block"></span>
            GET IN TOUCH
          </h1>
          <p className="font-body-lg text-lg text-on-surface-variant mb-10 max-w-lg">
            Have a complex engineering challenge? Need a custom hardware prototype or a scalable software backend? Describe your project requirements below.
          </p>

          <div className="space-y-8">
            <div className="glass-panel p-6 rounded-xl border-l-2 border-l-tertiary">
              <h3 className="font-headline-md text-xl text-on-surface mb-2">Academic Projects</h3>
              <p className="font-body-md text-sm text-on-surface-variant">We specialize in final-year engineering projects, complete with documentation, circuit schematics, and code walkthroughs.</p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border-l-2 border-l-secondary">
              <h3 className="font-headline-md text-xl text-on-surface mb-2">Industry Solutions</h3>
              <p className="font-body-md text-sm text-on-surface-variant">Looking for bespoke automation or IoT sensor networks? We can build scalable infrastructure tailored to your operational needs.</p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-panel glass-panel-glow rounded-xl p-8"
        >
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-20 text-center h-full">
              <CheckCircle className="w-20 h-20 text-secondary mb-6" />
              <h3 className="font-headline-md text-2xl text-on-surface mb-2">Request Transmitted</h3>
              <p className="font-body-md text-on-surface-variant">Our engineering team will review your specifications and contact you shortly.</p>
              <button onClick={() => setStatus('idle')} className="mt-8 text-emerald-500 font-label-caps text-sm">SEND ANOTHER MESSAGE</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Full Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field w-full rounded p-3 font-body-md text-sm" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Contact Number *</label>
                  <input type="text" name="contact_no" value={formData.contact_no} onChange={handleChange} required className="input-field w-full rounded p-3 font-body-md text-sm" placeholder="+91 9999999999" />
                </div>
              </div>

              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Institution / Company</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} className="input-field w-full rounded p-3 font-body-md text-sm" placeholder="University or Corp Name" />
              </div>

              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Expected Deadline *</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="input-field w-full rounded p-3 font-body-md text-sm" />
              </div>

              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Project Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="input-field w-full rounded p-3 font-body-md text-sm resize-none" placeholder="Describe the core features, hardware requirements, and end goals..."></textarea>
              </div>

              <button type="submit" disabled={status === 'submitting'} className="btn-thunderbolt py-4 mt-4 w-full flex justify-center items-center gap-2 font-headline-md uppercase tracking-widest">
                <span>{status === 'submitting' ? 'TRANSMITTING...' : 'SUBMIT REQUEST'}</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </motion.div>
      </div>

    </div>
  );
}

import { useState } from 'react';
import { FileText, Send, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Report() {
  const [formData, setFormData] = useState({
    name: '',
    contact_no: '',
    institution: '',
    deadline: '',
    description: '',
    format: 'IEEE',
    way_to_make: 'Complete Research',
    performance_tier: 'Standard'
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (file) {
      data.append('supporting_doc', file);
    }
    
    try {
      const res = await fetch('http://localhost:3000/api/report', {
        method: 'POST',
        body: data
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-tertiary/10 border border-tertiary/30 mb-6">
          <FileText className="w-8 h-8 text-tertiary" />
        </div>
        <h1 className="font-headline-xl text-4xl md:text-5xl text-on-surface mb-6 uppercase">ACADEMIC REPORTS & PAPERS</h1>
        <p className="font-body-lg text-lg text-on-surface-variant">
          Need a professionally formatted research paper, thesis report, or technical documentation for your project? We craft IEEE standard documents tailored to university requirements.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel glass-panel-glow max-w-4xl mx-auto rounded-xl p-8"
      >
        {status === 'success' ? (
          <div className="flex flex-col items-center justify-center py-20 text-center h-full">
            <CheckCircle className="w-20 h-20 text-tertiary mb-6" />
            <h3 className="font-headline-md text-2xl text-on-surface mb-2">Request Transmitted</h3>
            <p className="font-body-md text-on-surface-variant">Your report specifications have been uploaded. Our technical writers will contact you shortly.</p>
            <button onClick={() => setStatus('idle')} className="mt-8 text-tertiary font-label-caps text-sm border border-tertiary/30 px-6 py-2 rounded">SUBMIT ANOTHER</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="input-field w-full rounded p-3 font-body-md text-sm" />
              </div>
              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Contact Number *</label>
                <input type="text" name="contact_no" value={formData.contact_no} onChange={handleChange} required className="input-field w-full rounded p-3 font-body-md text-sm" />
              </div>
              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Institution</label>
                <input type="text" name="institution" value={formData.institution} onChange={handleChange} className="input-field w-full rounded p-3 font-body-md text-sm" />
              </div>
              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Expected Deadline *</label>
                <input type="date" name="deadline" value={formData.deadline} onChange={handleChange} required className="input-field w-full rounded p-3 font-body-md text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-outline-variant/30">
              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Format Style</label>
                <select name="format" value={formData.format} onChange={handleChange} className="input-field w-full rounded p-3 font-body-md text-sm cursor-pointer appearance-none">
                  <option>IEEE Conference</option>
                  <option>University Thesis</option>
                  <option>Technical Manual</option>
                  <option>Custom Format</option>
                </select>
              </div>
              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Way to Make</label>
                <select name="way_to_make" value={formData.way_to_make} onChange={handleChange} className="input-field w-full rounded p-3 font-body-md text-sm cursor-pointer appearance-none">
                  <option>Complete Research</option>
                  <option>Rewrite/Paraphrase</option>
                  <option>Proofreading Only</option>
                </select>
              </div>
              <div>
                <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Quality Tier</label>
                <select name="performance_tier" value={formData.performance_tier} onChange={handleChange} className="input-field w-full rounded p-3 font-body-md text-sm cursor-pointer appearance-none">
                  <option>Standard (UG)</option>
                  <option>Advanced (PG/Journal)</option>
                  <option>Premium (Scopus)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-outline-variant/30">
              <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Project Description & Topic *</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required rows="3" className="input-field w-full rounded p-3 font-body-md text-sm resize-none"></textarea>
            </div>

            <div>
              <label className="block font-code-sm text-xs text-on-surface-variant mb-2 uppercase tracking-widest">Supporting Documents (Optional)</label>
              <input type="file" onChange={handleFileChange} className="w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-tertiary/10 file:text-tertiary hover:file:bg-tertiary/20 file:transition-colors cursor-pointer" />
              <p className="text-xs text-on-surface-variant mt-2">Upload any base papers, rubrics, or abstracts (Max 25MB).</p>
            </div>

            <button type="submit" disabled={status === 'submitting'} className="bg-tertiary text-on-tertiary font-headline-md text-base uppercase tracking-widest py-4 mt-6 rounded flex justify-center items-center gap-2 hover:bg-tertiary-fixed transition-colors w-full shadow-[0_0_15px_rgba(47,217,244,0.3)]">
              <span>{status === 'submitting' ? 'UPLOADING...' : 'REQUEST REPORT'}</span>
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </motion.div>

    </div>
  );
}

import { motion } from 'framer-motion';
import { FileText, Shield, AlertTriangle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30">
            <FileText className="text-secondary w-6 h-6" />
          </div>
          <h1 className="font-headline-xl text-4xl text-on-surface uppercase">Terms of Service</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-xl flex flex-col gap-8"
        >
          <section>
            <h2 className="font-headline-md text-2xl text-secondary mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> 1. Acceptance of Terms
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              By accessing and using Zeus IoT Project Hub ("the Service"), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you must not use our services, hardware prototypes, or software deliverables.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-2xl text-secondary mb-4">2. Services and Deliverables</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              Zeus IoT provides custom hardware engineering, IoT sensor networks, and software backend solutions. All academic projects, prototypes, and code provided are intended for educational and research purposes. We guarantee the functionality of the hardware as per the agreed specifications at the time of delivery.
            </p>
            <ul className="list-disc list-inside font-body-md text-on-surface-variant space-y-2 ml-4">
              <li>Hardware components are subject to availability.</li>
              <li>Software maintenance is provided for 30 days post-delivery unless a separate SLA is signed.</li>
              <li>Academic reports are drafted as reference material and should not be submitted directly without review.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-2xl text-secondary mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-emerald-500" /> 3. Liability and Warranties
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              We warrant that custom hardware is free from defects at the time of handover. However, due to the experimental nature of IoT prototypes, we are not liable for damages resulting from improper handling, incorrect power supply, or environmental damage post-delivery.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-2xl text-secondary mb-4">4. Payment and Refunds</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              Payments are divided into milestones. A 50% non-refundable advance is required to commence hardware procurement and initial development. The final 50% is due upon successful demonstration of the project.
            </p>
          </section>

          <div className="border-t border-outline-variant/30 pt-6 mt-4">
            <p className="font-code-sm text-xs text-on-surface-variant uppercase tracking-widest">
              Last Updated: June 2026 | Zeus IoT Solutions, Chennai
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

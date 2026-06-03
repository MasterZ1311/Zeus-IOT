import { motion } from 'framer-motion';
import { Lock, Eye, Database } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center border border-tertiary/30">
            <Lock className="text-tertiary w-6 h-6" />
          </div>
          <h1 className="font-headline-xl text-4xl text-on-surface uppercase">Privacy Policy</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-xl flex flex-col gap-8"
        >
          <section>
            <h2 className="font-headline-md text-2xl text-tertiary mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5" /> 1. Information We Collect
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              When you submit a project request or contact form on Zeus IoT, we collect personal information including your name, contact number, institution, and project specifications. We also collect anonymized telemetry data from IoT nodes to populate the live dashboard (if applicable to your project).
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-2xl text-tertiary mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" /> 2. How We Use Your Data
            </h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              Your data is strictly used to:
            </p>
            <ul className="list-disc list-inside font-body-md text-on-surface-variant space-y-2 ml-4">
              <li>Process and engineer your specific IoT/Software requirements.</li>
              <li>Communicate milestone updates and deliver project files.</li>
              <li>Improve our hardware algorithms based on aggregated, non-identifiable sensor data.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-headline-md text-2xl text-tertiary mb-4">3. Data Protection and Security</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              We employ industry-standard encryption (AES-256 for databases, TLS for transit) to protect your project specifications and intellectual property. We do not sell, rent, or lease your personal information or project ideas to any third party. Academic project ideas are kept strictly confidential until you present them.
            </p>
          </section>

          <section>
            <h2 className="font-headline-md text-2xl text-tertiary mb-4">4. Your Rights</h2>
            <p className="font-body-md text-on-surface-variant leading-relaxed mb-4">
              You have the right to request the deletion of your personal data and project files from our servers post-delivery. To initiate a data purge, please contact our support team.
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

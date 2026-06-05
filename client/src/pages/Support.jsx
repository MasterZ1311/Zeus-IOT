import { motion } from 'framer-motion';
import { LifeBuoy, Wrench, FileCode, Clock } from 'lucide-react';

export default function Support() {
  return (
    <div className="px-4 md:px-16 max-w-[1280px] mx-auto w-full pt-10">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/30">
            <LifeBuoy className="text-secondary w-6 h-6" />
          </div>
          <h1 className="font-headline-xl text-4xl text-on-surface uppercase">Help & Support</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 rounded-xl flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 text-secondary">
              <Wrench className="w-5 h-5" />
              <h3 className="font-headline-md text-xl">Hardware Troubleshooting</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant flex-grow">
              Having issues with a sensor module or power delivery? Ensure that you are using the correct 5V/12V adapters as specified in your project manual. DO NOT swap jumper wires while the board is powered.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-xl flex flex-col gap-4"
          >
            <div className="flex items-center gap-3 text-emerald-500">
              <FileCode className="w-5 h-5" />
              <h3 className="font-headline-md text-xl">Software & Code Bugs</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant flex-grow">
              If the dashboard isn't updating, check the local node server logs. For code explanations or minor tweaks before an academic review, reach out via WhatsApp with your Project ID.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-xl flex flex-col gap-4 md:col-span-2"
          >
            <div className="flex items-center gap-3 text-on-surface">
              <Clock className="w-5 h-5" />
              <h3 className="font-headline-md text-xl">Contact Support Team</h3>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">
              Our standard support hours are Monday through Saturday, 9:00 AM to 7:00 PM IST. 
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <div className="bg-surface-container-high rounded p-3 border border-outline-variant/30 flex-1">
                <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">WhatsApp Fast-Track</span>
                <span className="font-body-md text-secondary">+91 90808 09088</span>
              </div>
              <div className="bg-surface-container-high rounded p-3 border border-outline-variant/30 flex-1">
                <span className="block font-code-sm text-xs text-on-surface-variant uppercase mb-1">Email Support</span>
                <span className="font-body-md text-emerald-500">zeusiotprojects@gmail.com</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

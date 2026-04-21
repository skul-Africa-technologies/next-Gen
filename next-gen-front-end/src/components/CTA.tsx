"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ready to Grow Beyond the Classroom?
          </h2>
          <p className="mt-4 text-gray-400 text-lg">
            Join Next Gen and start building your future today. Connect with mentors, 
            attend events, and earn certifications that set you apart.
          </p>
          <Link href="/signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="mt-8 rounded-xl bg-primary px-8 py-4 font-semibold text-black hover:bg-primary/90 transition-all orange-glow"
            >
              Join Next Gen
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
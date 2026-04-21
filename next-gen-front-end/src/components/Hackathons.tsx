"use client";

import { motion } from "framer-motion";
import { FiCode, FiUsers, FiAward, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const highlights = [
  {
    icon: FiCode,
    title: "Build Real Projects",
    description: "Transform ideas into working prototypes",
  },
  {
    icon: FiUsers,
    title: "Team Collaboration",
    description: "Work with diverse teams from across campus",
  },
  {
    icon: FiAward,
    title: "Win Prizes",
    description: "Compete for prizes and recognition",
  },
];

export default function Hackathons() {
  return (
    <section id="hackathons" className="py-24 px-6 bg-black relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-primary/20" />
              
              {/* Overlay content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="flex gap-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="px-4 py-2 rounded-full bg-primary/30 border border-primary/50 backdrop-blur-sm"
                  >
                    <span className="text-white font-semibold">Innovation</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm"
                  >
                    <span className="text-white font-semibold">Creativity</span>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Floating stats card */}
     
          </motion.div>

          {/* Right - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <FiCode className="text-primary" />
              <span className="text-primary font-medium text-sm">Innovation</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Hackathons &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                Innovation
              </span>
            </h2>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Students build real projects, solve problems, and compete in events that push the boundaries of creativity and technology. Join the innovation ecosystem.
            </p>

            {/* Highlights */}
            <div className="space-y-4 mb-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-primary/30 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="text-primary w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link 
              href="#events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90 transition-all hover:gap-3"
            >
              Explore Events <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

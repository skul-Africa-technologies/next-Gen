"use client";

import { motion } from "framer-motion";
import { FiUsers, FiMessageCircle, FiTrendingUp, FiLink, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

const benefits = [
  {
    icon: FiUsers,
    title: "Peer Connections",
    description: "Build lasting relationships with fellow students",
  },
  {
    icon: FiMessageCircle,
    title: "Open Discussions",
    description: "Engage in meaningful conversations",
  },
  {
    icon: FiTrendingUp,
    title: "Growth Network",
    description: "Expand your professional circle",
  },
  {
    icon: FiLink,
    title: "Industry Links",
    description: "Connect with experts and professionals",
  },
];

export default function Networking() {
  return (
    <section id="networking" className="py-24 px-6 bg-gradient-to-b from-black to-[#0a0a0a] relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
            <FiUsers className="text-primary" />
            <span className="text-primary font-medium text-sm">Community</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Networking &<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Community
            </span>
          </h2>

          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Connect with peers, mentors, and industry experts. Build your network and grow together in a supportive community.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Image Stack */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="relative h-[350px] rounded-3xl overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1529156069899-49993e0b8d17?w=800&q=80')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              
              {/* Overlay Text */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-lg font-semibold">Your Network is Your Net Worth</p>
                <p className="text-gray-400 text-sm">Start building today</p>
              </div>
            </div>

            {/* Stats Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex gap-4 mt-4"
            >
              <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-2xl font-bold text-primary">5K+</p>
                <p className="text-gray-400 text-xs">Active Members</p>
              </div>
              <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                <p className="text-2xl font-bold text-primary">50+</p>
                <p className="text-gray-400 text-xs">Industry Partners</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - Benefits Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 hover:bg-white/10 transition-all cursor-default"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                    <benefit.icon className="text-primary w-6 h-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
            >
              <Link 
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-black font-semibold hover:bg-primary/90 transition-all hover:gap-3"
              >
                Join Community <FiArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-gray-500 text-sm">
                Free to join • Active community of 5,000+ students
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

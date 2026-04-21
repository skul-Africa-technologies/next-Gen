"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image - Student Group */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=1920&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Dark Overlay with Orange Gradient */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/60 to-black/80" />
      
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 z-10 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi0xMi01LjM3My0xMi0xMi0xMnptMCAyMmMtNS4zNzMgMC05LjUtNC4xMjctOS41LTlkuNSA0LjEyNy05LjUgOS41IDkuNSA5LjUgNS4zNzMgMCA5LjUgNC4xMjcgOS41IDkuNS00LjEyNyA5LjUtOS41IDkuNXoiIGZpbGw9IiNmZjZiMDAiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-white">Empowering Future Leaders</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="text-white">Empowering the </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              Next Generation
            </span>
            <br />
            <span className="text-white">of Leaders</span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Join a vibrant community of ambitious students. Access exclusive events, 
            develop leadership skills, and connect with mentors who'll guide your journey to success.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(255, 107, 0, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl bg-primary text-black font-semibold text-lg transition-all"
            >
              <Link href="/signup">Get Started</Link>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: "rgba(255, 107, 0, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 rounded-xl border-2 border-white/30 text-white font-medium text-lg hover:bg-white/10 transition-all"
            >
              <Link href="#events">View Events</Link>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2"
        >
          <motion.div className="w-1 h-2 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
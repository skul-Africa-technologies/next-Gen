"use client";

import { motion } from "framer-motion";

const steps = [
  { title: "Create Account", description: "Sign up for free and set up your student profile" },
  { title: "Explore Programs", description: "Browse events, mentorship, and skills programs" },
  { title: "Grow & Achieve", description: "Learn, network, and earn certifications" },
];

export default function HowItWorks() {
  return (
    <section id="about" className="py-24 px-6 bg-black">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white">How It Works</h2>
          <p className="mt-4 text-gray-400">Start your journey in three simple steps</p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg mb-4">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-gray-400">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 text-gray-600">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
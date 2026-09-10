"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Calendar,
  Layers,
  Users,
  Info,
  LogIn,
} from "lucide-react";

const navItems = [
  { icon: Home,     label: "Home",     href: "/",         isAnchor: false },
  { icon: Calendar, label: "Events",   href: "#events",   isAnchor: true  },
  { icon: Layers,   label: "Programs", href: "#programs", isAnchor: true  },
  { icon: Users,    label: "About",    href: "#about",    isAnchor: true  },
  { icon: Info,     label: "Contact",  href: "#contact",  isAnchor: true  },
];

const ctaItem = {
  icon: LogIn,
  label: "Join Now",
  href: "/signup",
};

// ── Single nav icon button ─────────────────────────────────────────────────
function NavIcon({
  item,
  isActive,
  index,
}: {
  item: (typeof navItems)[0] | typeof ctaItem;
  isActive?: boolean;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;
  const isCta = item.label === "Join Now";

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08 + index * 0.05, ease: "easeOut" }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
    >
      <Link
        href={item.href}
        aria-label={item.label}
        title={item.label}
        scroll={true}
        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
      >
        <motion.div
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.90 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="w-10 h-10 flex items-center justify-center rounded-xl relative"
          style={
            isActive
              ? {
                  background: "linear-gradient(135deg, rgba(255,107,0,0.28), rgba(255,107,0,0.12))",
                  border: "1px solid rgba(255,107,0,0.45)",
                  boxShadow: "0 0 16px rgba(255,107,0,0.22), inset 0 1px 1px rgba(255,255,255,0.12)",
                }
              : isCta
              ? {
                  background: "linear-gradient(135deg, rgba(255,107,0,0.92), rgba(204,86,0,0.9))",
                  border: "1px solid rgba(255,107,0,0.6)",
                  boxShadow: "0 0 18px rgba(255,107,0,0.35), inset 0 1px 1px rgba(255,255,255,0.2)",
                }
              : hovered
              ? {
                  background: "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.05))",
                  border: "1px solid rgba(255,255,255,0.2)",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.28)",
                }
              : {
                  background: "transparent",
                  border: "1px solid transparent",
                  boxShadow: "none",
                }
          }
        >
          <Icon
            size={18}
            strokeWidth={isActive || isCta ? 2.2 : 1.8}
            className={isCta ? "text-white" : isActive ? "text-primary" : "text-neutral-400"}
            style={isActive ? { filter: "drop-shadow(0 0 5px rgba(255,107,0,0.6))" } : undefined}
          />
        </motion.div>
      </Link>

      {/* Tooltip — drops below */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.92 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 z-[60] pointer-events-none whitespace-nowrap"
          >
            <div
              className="px-2.5 py-1 rounded-lg text-xs font-medium text-white"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.13), rgba(255,255,255,0.04))",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)",
              }}
            >
              {item.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Mobile bottom nav ──────────────────────────────────────────────────────
function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden"
      style={{ width: "min(calc(100vw - 32px), 360px)" }}
    >
      <div
        className="flex items-center justify-around px-3 py-2.5 rounded-[22px]"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
          border: "1px solid rgba(255,255,255,0.18)",
          backdropFilter: "blur(28px) saturate(180%)",
          WebkitBackdropFilter: "blur(28px) saturate(180%)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 1px rgba(255,255,255,0.28)",
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = !item.isAnchor && pathname === item.href;
          return (
            <Link key={item.href} href={item.href} aria-label={item.label} className="focus:outline-none">
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="w-10 h-10 flex items-center justify-center rounded-xl"
                style={
                  isActive
                    ? { background: "rgba(255,107,0,0.2)", border: "1px solid rgba(255,107,0,0.4)" }
                    : undefined
                }
              >
                <Icon size={19} className={isActive ? "text-primary" : "text-neutral-400"} />
              </motion.div>
            </Link>
          );
        })}
        <Link href={ctaItem.href} aria-label={ctaItem.label} className="focus:outline-none">
          <motion.div
            whileTap={{ scale: 0.85 }}
            className="w-10 h-10 flex items-center justify-center rounded-xl"
            style={{
              background: "linear-gradient(135deg, rgba(255,107,0,0.92), rgba(204,86,0,0.9))",
              border: "1px solid rgba(255,107,0,0.6)",
              boxShadow: "0 0 14px rgba(255,107,0,0.3)",
            }}
          >
            <ctaItem.icon size={19} className="text-white" />
          </motion.div>
        </Link>
      </div>
    </motion.nav>
  );
}

// ── Desktop top glass nav ──────────────────────────────────────────────────
export default function IconSidebar() {
  const pathname = usePathname();

  function isActive(item: (typeof navItems)[0]) {
    return !item.isAnchor && pathname === item.href;
  }

  return (
    <>
      {/*
       * position:fixed, top accounts for the shell inset (20px) + inner gap (12px).
       * left-0 right-0 + flex justify-center = true horizontal center.
       * This works regardless of overflow:hidden on the shell because fixed
       * elements escape overflow clipping entirely.
       */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="hidden md:flex fixed left-0 right-0 z-50 justify-center"
        style={{ top: "calc(20px + 12px)" }}
        aria-label="Main navigation"
      >
        {/* Glass pill */}
        <div
          className="flex items-center gap-1 px-3 py-2 rounded-[20px]"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.11), rgba(255,255,255,0.04))",
            border: "1px solid rgba(255,255,255,0.14)",
            backdropFilter: "blur(28px) saturate(180%)",
            WebkitBackdropFilter: "blur(28px) saturate(180%)",
            boxShadow:
              "0 8px 32px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.28), inset 0 -1px 1px rgba(0,0,0,0.05)",
          }}
        >
          {/* NG logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="mr-2"
          >
            <Link href="/" aria-label="NextGen – Home">
              <motion.div
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold leading-none select-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,107,0,0.95), rgba(204,86,0,0.9))",
                  border: "1px solid rgba(255,107,0,0.5)",
                  boxShadow: "0 0 16px rgba(255,107,0,0.3), inset 0 1px 1px rgba(255,255,255,0.25)",
                  color: "#fff",
                  fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
                  letterSpacing: "-0.03em",
                }}
              >
                NG
              </motion.div>
            </Link>
          </motion.div>

          {/* Divider */}
          <div className="h-5 w-px mx-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* Nav icons */}
          {navItems.map((item, i) => (
            <NavIcon key={item.href} item={item} isActive={isActive(item)} index={i} />
          ))}

          {/* Divider */}
          <div className="h-5 w-px mx-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />

          {/* CTA */}
          <NavIcon item={ctaItem} isActive={false} index={navItems.length} />
        </div>
      </motion.nav>

      {/* Mobile bottom nav */}
      <MobileBottomNav />
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiUsers, FiClock, FiBell, FiLoader } from "react-icons/fi";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useStudentApi } from "@/lib/student-api";

export default function DashboardHome() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    appliedEvents: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { getCurrentUser, getUpcomingEvents, getStudentAppliedEvents, getStudentDashboardStats } = useStudentApi();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const user = getCurrentUser();
        if (!user?._id) {
          toast.error("User not found");
          setIsLoading(false);
          return;
        }

        // Fetch dashboard stats from dedicated endpoint
        const [statsRes, upcomingEventsRes] = await Promise.all([
          getStudentDashboardStats(user._id),
          getUpcomingEvents(),
        ]);

        setStats(statsRes);

        // Display up to 3 upcoming events
        const eventsToShow = Array.isArray(upcomingEventsRes) ? upcomingEventsRes.slice(0, 3) : [];
        setUpcomingEvents(eventsToShow);

      } catch (err: any) {
        console.error("Failed to load dashboard data:", err);
        toast.error("Failed to load dashboard data");
        setError(err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [getStudentDashboardStats, getUpcomingEvents, getCurrentUser]);

  if (isLoading) {
    return (
      <div className="p-4 lg:p-8">
        <SkeletonLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary rounded-lg hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const user = getCurrentUser();
  const displayName = user?.name || "Student";
  const firstName = displayName.split(" ")[0];

  return (
    <div className="w-full">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 lg:mb-12"
      >
        <h1 className="text-3xl lg:text-4xl font-bold mb-3">
          Welcome back, <span className="text-primary">{firstName}</span> 👋
        </h1>
        <p className="text-neutral-400 text-lg">
          Ready to explore new opportunities today?
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-8 lg:mb-12"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: 0.3,
            },
          },
        }}
      >
        <StatCard
          icon={FiCalendar}
          label="Total Events"
          value={stats.totalEvents}
          bgGradient="from-purple-500/20 to-pink-500/20"
          borderColor="border-purple-500/20"
          glowColor="shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          color="text-purple-400"
          delay={0}
        />
        <StatCard
          icon={FiClock}
          label="Upcoming Events"
          value={stats.upcomingEvents}
          bgGradient="from-blue-500/20 to-cyan-500/20"
          borderColor="border-blue-500/20"
          glowColor="shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          color="text-blue-400"
          delay={1}
        />
        <StatCard
          icon={FiUsers}
          label="Applied Events"
          value={stats.appliedEvents}
          bgGradient="from-primary/20 to-orange-500/20"
          borderColor="border-primary/20"
          glowColor="shadow-[0_0_30px_rgba(249,115,22,0.3)]"
          color="text-orange-400"
          delay={2}
        />
      </motion.div>

      {/* Recent & Upcoming Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-neutral-900/50 rounded-2xl border border-neutral-800 p-4 lg:p-6"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <FiBell className="text-primary" />
          Upcoming Events
        </h2>
        <div className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event, index) => (
              <motion.div
                key={event._id || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-4 p-3 rounded-xl bg-neutral-800/50 border border-neutral-800 hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <FiCalendar className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{event.title}</h3>
                  <p className="text-sm text-neutral-400">
                    {new Date(event.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                    {event.location && ` • ${event.location}`}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-medium">
                  Upcoming
                </span>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-400">
              <FiCalendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming events</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  bgGradient,
  borderColor,
  glowColor,
  color,
  delay,
}: {
  icon: any;
  label: string;
  value: number;
  bgGradient: string;
  borderColor: string;
  glowColor: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      custom={delay}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: i * 0.1 },
        }),
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={`relative p-4 lg:p-6 rounded-2xl border ${borderColor} ${bgGradient} ${glowColor} transition-all duration-300 overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className={`w-10 h-10 rounded-xl ${bgGradient} ${color} flex items-center justify-center`}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <p className="text-2xl lg:text-3xl font-bold mb-1">{value}</p>
        <p className="text-neutral-400 text-sm">{label}</p>
      </div>
    </motion.div>
  );
}

function SkeletonLoader() {
  return (
    <div>
      <div className="h-12 w-64 bg-neutral-800 rounded-lg mb-6 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-neutral-800 rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="h-64 bg-neutral-800 rounded-2xl animate-pulse" />
    </div>
  );
}

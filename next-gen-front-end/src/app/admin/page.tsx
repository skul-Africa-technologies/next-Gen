"use client";

import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiCalendar, FiTrendingUp, FiLoader, FiAlertCircle } from "react-icons/fi";
import { api } from "@/lib/api";
import { AuthContext } from "@/lib/auth-context";

interface Stats {
  totalStudents: number;
  totalEvents: number;
  totalStories: number;
}

interface Event {
  _id: string;
  title: string;
  date: string;
  location: string;
  attendees: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({ totalStudents: 0, totalEvents: 0, totalStories: 0 });
  const [recentEvents, setRecentEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    // Verify auth state via context - if not authenticated, layout will redirect
    if (authContext?.isAuthLoading) {
      setTimeout(fetchData, 100);
      return;
    }

    if (!authContext?.isAuthenticated) {
      return;
    }

    try {
      setError(null);
      const result = await api.getDashboard();
      
      if (result.success && result.data) {
        setStats({
          totalStudents: result.data.totalStudents || 0,
          totalEvents: result.data.totalEvents || 0,
          totalStories: result.data.totalStories || 0,
        });
      } else if (result.error && result.error.includes('401')) {
        // Session expired
        authContext?.logout().catch(() => {});
        setError("Session expired. Please log in again.");
      } else {
        setError(result.message || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to fetch dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: FiUsers, color: "text-primary", bg: "bg-primary/10" },
    { label: "Total Events", value: stats.totalEvents, icon: FiCalendar, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Total Stories", value: stats.totalStories, icon: FiTrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
        </div>
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-3 text-red-400">
            <FiAlertCircle size={24} />
            <p>{error}</p>
          </div>
          {error.includes("Session expired") && (
            <button
              onClick={() => {
                authContext?.logout().catch(() => {});
              }}
              className="mt-4 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors"
            >
              Go to Login
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-1">Welcome back! Here&apos;s what&apos;s happening.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 hover:border-primary/30 transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`w-14 h-14 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon className={`${stat.color} text-2xl`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Events - Not available in new architecture */}
      <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/10">
        <h2 className="text-xl font-semibold text-white mb-6">Recent Events</h2>
        <div className="text-center py-12 text-gray-500">
          <FiCalendar className="text-4xl mx-auto mb-4 opacity-50" />
          <p>Events functionality has been rearchitected. Please use the Events module separately.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/admin/events?create=true"
          className="p-6 rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 border border-primary/30 hover:border-primary/50 transition-all group"
        >
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
            Create New Event
          </h3>
          <p className="text-gray-400 text-sm">
            Add a new event for students to participate in
          </p>
        </a>
        <a
          href="/admin/students"
          className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all group"
        >
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-primary transition-colors">
            View All Students
          </h3>
          <p className="text-gray-400 text-sm">
            Browse through all registered students
          </p>
        </a>
      </div>
    </div>
  );
}

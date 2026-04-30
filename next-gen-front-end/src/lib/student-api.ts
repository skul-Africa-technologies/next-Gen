import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export interface Student {
  _id: string;
  name: string;
  email: string;
  school?: string;
  level?: string;
  role?: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export function useStudentApi() {
  const router = useRouter();

  const checkAuth = (): boolean => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
      return false;
    }
    return true;
  };

  const getCurrentUser = (): Student | null => {
    const userStr = localStorage.getItem("user");
    if (userStr && userStr !== "undefined") {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  };

  const getUserById = async (id?: string): Promise<Student | null> => {
    if (!checkAuth()) return null;

    const token = localStorage.getItem("accessToken");
    const userId = id || getCurrentUser()?._id;

    if (!userId) {
      toast.error("User ID not found");
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const result = await response.json();
      const userData = result.data || result;
      localStorage.setItem("user", JSON.stringify(userData));
      return userData as Student;
    } catch (error) {
      toast.error("Failed to fetch user data");
      return getCurrentUser();
    }
  };

  const updateUser = async (id: string, data: Partial<Student>): Promise<boolean> => {
    if (!checkAuth()) return false;

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/students/${id}/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const result = await response.json();
      const updatedUser = result.data || result;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to update profile");
      return false;
    }
  };

  const getAllEvents = async (): Promise<Event[]> => {
    if (!checkAuth()) return [];

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch events");
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      toast.error("Failed to fetch events");
      return [];
    }
  };

  const getUpcomingEvents = async (): Promise<Event[]> => {
    if (!checkAuth()) return [];

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/events/upcoming`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch upcoming events");
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      toast.error("Failed to fetch upcoming events");
      return [];
    }
  };

  const getStudentAppliedEvents = async (): Promise<Event[]> => {
    if (!checkAuth()) return [];

    const user = getCurrentUser();
    if (!user?._id) {
      toast.error("User not found");
      return [];
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/students/${user._id}/applied-events`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch applied events");
      }

      const result = await response.json();
      return result.data || [];
    } catch (error) {
      toast.error("Failed to fetch applied events");
      return [];
    }
  };

  const getStudentDashboardStats = async (studentId: string): Promise<{ totalEvents: number; upcomingEvents: number; appliedEvents: number }> => {
    if (!checkAuth()) return { totalEvents: 0, upcomingEvents: 0, appliedEvents: 0 };

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${API_URL}/students/${studentId}/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }

      const result = await response.json();
      return result.data || { totalEvents: 0, upcomingEvents: 0, appliedEvents: 0 };
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
      return { totalEvents: 0, upcomingEvents: 0, appliedEvents: 0 };
    }
  };

  const applyForEvent = async (eventId: string): Promise<boolean> => {
    if (!checkAuth()) return false;

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch(`${API_URL}/events/${eventId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to apply for event");
      }

      toast.success("Applied for event successfully!");
      return true;
    } catch (error) {
      toast.error("Failed to apply for event");
      return false;
    }
  };

  return {
    getCurrentUser,
    getUserById,
    updateUser,
    getAllEvents,
    getUpcomingEvents,
    getStudentAppliedEvents,
    applyForEvent,
    getStudentDashboardStats,
  };
}

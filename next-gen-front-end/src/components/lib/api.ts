const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authApi = {
  adminLogin: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/api/v1/auth/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Login failed",
      };
    }

    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    return { success: true, data };
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    if (user && user !== "undefined") {
      try {
        return JSON.parse(user);
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error);
        localStorage.removeItem("user");
        return null;
      }
    }
    return null;
  },

  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      const data = await res.json();

      if (!res.ok) return false;

      localStorage.setItem("accessToken", data.token);
      return true;
    } catch {
      return false;
    }
  },

  logout: async () => {
    localStorage.clear();
  },
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export const authApi = {
  adminLogin: async (email: string, password: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return data;
      }
      
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  studentLogin: async (email: string, password: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return data;
      }
      
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'Network error. Please try again.' };
    }
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: getHeaders(),
        });
      } catch (e) {
        // Ignore errors on logout
      }
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refreshToken: async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAdmin: (): boolean => {
    const user = authApi.getCurrentUser();
    return user?.role === 'admin';
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken');
  },
};

export const adminApi = {
  getDashboard: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to fetch dashboard data' };
    }
  },

  getActivity: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/admin/activity`, {
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to fetch activity data' };
    }
  },

  getStudents: async (page = 1, limit = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/admin/students?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to fetch students' };
    }
  },

  getEvents: async (page = 1, limit = 10): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/admin/events?page=${page}&limit=${limit}`, {
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to fetch events' };
    }
  },
};

export const eventsApi = {
  getAll: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to fetch events' };
    }
  },

  create: async (event: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(event),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to create event' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to delete event' };
    }
  },
};

export const usersApi = {
  getAll: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to fetch users' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to delete user' };
    }
  },
};

export const storiesApi = {
  getAll: async (): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/stories`);
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to fetch stories' };
    }
  },

  create: async (story: any): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/stories`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(story),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to create story' };
    }
  },

  delete: async (id: string): Promise<ApiResponse<any>> => {
    try {
      const response = await fetch(`${API_URL}/stories/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      return { success: false, message: 'Failed to delete story' };
    }
  },
};

// Unified API client for backward compatibility
export const api = {
  // Auth
  login: authApi.adminLogin,
  logout: async () => {
    await authApi.logout();
    return { success: true, message: 'Logged out' };
  },
  refreshToken: authApi.refreshToken,

  // Admin
  getDashboard: adminApi.getDashboard,
  getActivity: adminApi.getActivity,
  getStudents: adminApi.getStudents,
  getEvents: adminApi.getEvents,
  createEvent: eventsApi.create,
  deleteEvent: eventsApi.delete,
  getUsers: usersApi.getAll,
  deleteUser: usersApi.delete,
  createStory: storiesApi.create,
  deleteStory: storiesApi.delete,
};
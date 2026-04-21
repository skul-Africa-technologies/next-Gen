const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  interestedBy?: string[];
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  school?: string;
  interestedEvents?: string[];
}

export const eventsApi = {
  async getAll(): Promise<Event[]> {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },

  async getOne(id: string): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  },

  async getUpcoming(): Promise<Event[]> {
    const response = await fetch(`${API_URL}/events/upcoming`);
    if (!response.ok) {
      throw new Error('Failed to fetch upcoming events');
    }
    return response.json();
  },

  async search(query: string): Promise<Event[]> {
    const response = await fetch(`${API_URL}/events?search=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search events');
    }
    return response.json();
  },

  async create(event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  },

  async update(id: string, event: Partial<Event>): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  },

  async markInterest(eventId: string, studentId: string): Promise<Event> {
    const response = await fetch(`${API_URL}/events/${eventId}/interest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId }),
    });
    if (!response.ok) {
      throw new Error('Failed to mark interest');
    }
    return response.json();
  },
};

export const studentsApi = {
  async register(student: Partial<Student>): Promise<Student> {
    const response = await fetch(`${API_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    if (!response.ok) {
      throw new Error('Failed to register student');
    }
    return response.json();
  },
};

export const notificationsApi = {
  async sendBulkEmail(subject: string, body: string): Promise<{ success: boolean; sent: number }> {
    const response = await fetch(`${API_URL}/notifications/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject, body, type: 'announcement' }),
    });
    if (!response.ok) {
      throw new Error('Failed to send notifications');
    }
    return response.json();
  },
};
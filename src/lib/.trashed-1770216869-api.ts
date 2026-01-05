import { Habit, parseProgressJson } from '@/types';
import { getAuthHeaders, API_BASE_URL } from '@/lib/auth';

// Fetch with auth headers and timeout
const authFetch = async (
  url: string,
  options: RequestInit = {},
  timeout = 15000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

// Habit API
export interface HabitCreateDTO {
  name: string;
  initDate: string;
  metadataJson: string;
}

export interface HabitUpdateDTO {
  name?: string;
  metadataJson?: string;
  isActive?: boolean;
}

export const habitApi = {
  listByUser: async (userId: number): Promise<Habit[]> => {
    const response = await authFetch(`${API_BASE_URL}/users/${userId}/habits`);
    if (!response.ok) throw new Error('Failed to fetch habits');
    return response.json();
  },

  getById: async (userId: number, habitId: number): Promise<Habit | null> => {
    const response = await authFetch(`${API_BASE_URL}/users/${userId}/habits/${habitId}`);
    if (!response.ok) return null;
    return response.json();
  },

  create: async (userId: number, dto: HabitCreateDTO): Promise<Habit> => {
    const response = await authFetch(`${API_BASE_URL}/users/${userId}/habits`, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error('Failed to create habit');
    return response.json();
  },

  update: async (userId: number, habitId: number, dto: HabitUpdateDTO): Promise<Habit> => {
    const response = await authFetch(`${API_BASE_URL}/users/${userId}/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
    if (!response.ok) throw new Error('Failed to update habit');
    return response.json();
  },

  delete: async (userId: number, habitId: number): Promise<void> => {
    const response = await authFetch(`${API_BASE_URL}/users/${userId}/habits/${habitId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete habit');
  },

  updateProgress: async (
    userId: number, 
    habitId: number, 
    currentProgressJson: string,
    date: string, 
    completed: boolean
  ): Promise<Habit> => {
    const progress = parseProgressJson(currentProgressJson);
    const existingIndex = progress.findIndex(p => p.date === date);
    
    if (existingIndex >= 0) {
      progress[existingIndex].completed = completed;
    } else {
      progress.push({ date, completed });
    }
    
    progress.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    const response = await authFetch(`${API_BASE_URL}/users/${userId}/habits/${habitId}`, {
      method: 'PUT',
      body: JSON.stringify({
        progressJson: JSON.stringify(progress)
      }),
    });
    if (!response.ok) throw new Error('Failed to update progress');
    return response.json();
  },
};

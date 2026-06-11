// ============================================================
// ArtisanConnect — API Service (FastAPI/PostgreSQL backend)
// Remplace toutes les opérations Firebase/Firestore
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// ---- Token storage helpers ----
export const TokenStorage = {
  getAccess: (): string | null => localStorage.getItem('access_token'),
  getRefresh: (): string | null => localStorage.getItem('refresh_token'),
  set: (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  clear: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
  },
  setUser: (user: any) => localStorage.setItem('user_data', JSON.stringify(user)),
  getUser: (): any | null => {
    const raw = localStorage.getItem('user_data');
    return raw ? JSON.parse(raw) : null;
  },
};

// ---- Core fetch wrapper ----
async function request<T>(
  path: string,
  options: RequestInit = {},
  requiresAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined),
  };
  
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  if (requiresAuth) {
    const token = TokenStorage.getAccess();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401 && requiresAuth) {
    // Try to refresh
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${TokenStorage.getAccess()}`;
      const retried = await fetch(`${BASE_URL}${path}`, { ...options, headers });
      if (!retried.ok) {
        const err = await retried.json().catch(() => ({}));
        throw new Error(err?.detail?.error || err?.detail || `HTTP ${retried.status}`);
      }
      return retried.json() as Promise<T>;
    } else {
      TokenStorage.clear();
      window.location.href = '/login';
      throw new Error('Session expirée. Veuillez vous reconnecter.');
    }
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const detail = err?.detail;
    let message: string;
    if (Array.isArray(detail)) {
      message = detail.map((d: any) => d.msg || JSON.stringify(d)).join(', ');
    } else if (typeof detail === 'object' && detail !== null) {
      message = detail.error || JSON.stringify(detail);
    } else {
      message = detail || `HTTP ${res.status}`;
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

async function tryRefreshToken(): Promise<boolean> {
  const refreshToken = TokenStorage.getRefresh();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`, {
      method: 'POST',
    });
    if (!res.ok) return false;
    const data = await res.json();
    TokenStorage.set(data.access_token, data.refresh_token);
    return true;
  } catch {
    return false;
  }
}

// ============================================================
// AUTH
// ============================================================
export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  role: 'client' | 'artisan' | 'admin';
  phone?: string;
  avatar_url?: string;
  profession?: string;
  specialties?: string[];
  location?: string;
  city?: string;
  lat?: number;
  lng?: number;
  available_days?: string[];
  languages?: string[];
  is_available: boolean;
  price_range_min?: number;
  price_range_max?: number;
  free_quote: boolean;
  bio?: string;
  rating: number;
  review_count: number;
  completion_rate: number;
  response_time_minutes: number;
  is_verified: boolean;
  id_verified: boolean;
  created_at: string;
  last_seen?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export const auth = {
  async login(email: string, password: string): Promise<AuthTokens> {
    const data = await request<AuthTokens>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }, false);
    TokenStorage.set(data.access_token, data.refresh_token);
    const me = await users.getMe();
    TokenStorage.setUser(me);
    return data;
  },

  async register(payload: {
    email: string;
    password: string;
    display_name: string;
    role: string;
    location?: string;
    profession?: string;
  }): Promise<AuthTokens> {
    const data = await request<AuthTokens>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }, false);
    TokenStorage.set(data.access_token, data.refresh_token);
    const me = await users.getMe();
    TokenStorage.setUser(me);
    return data;
  },

  logout() {
    TokenStorage.clear();
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return request(`/auth/forgot-password?email=${encodeURIComponent(email)}`, { method: 'POST' }, false);
  },

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    return request(`/auth/reset-password?token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`, { method: 'POST' }, false);
  },
};

// ============================================================
// USERS
// ============================================================
export const users = {
  getMe: (): Promise<UserProfile> => request('/users/me'),

  updateMe: (data: Partial<UserProfile>): Promise<UserProfile> =>
    request('/users/me', { method: 'PUT', body: JSON.stringify(data) }),

  getPublicProfile: (id: string): Promise<UserProfile> =>
    request(`/users/${id}/public-profile`, {}, false),

  updateAvailability: (is_available: boolean): Promise<UserProfile> =>
    request(`/users/me/availability?is_available=${is_available}`, { method: 'PUT' }),

  getNearby: (params: { lat: number; lng: number; radius?: number; category?: string; limit?: number }): Promise<UserProfile[]> => {
    const q = new URLSearchParams({
      lat: String(params.lat),
      lng: String(params.lng),
      ...(params.radius !== undefined && { radius: String(params.radius) }),
      ...(params.category && { category: params.category }),
      ...(params.limit !== undefined && { limit: String(params.limit) }),
    });
    return request(`/users/nearby?${q}`, {}, false);
  },

  listArtisans: (params?: { category?: string; city?: string; limit?: number }): Promise<UserProfile[]> => {
    const q = new URLSearchParams({ role: 'artisan' });
    if (params?.category && params.category !== 'Toutes') q.append('category', params.category);
    if (params?.city) q.append('city', params.city);
    if (params?.limit) q.append('limit', String(params.limit));
    return request(`/users?${q}`, {}, false);
  },

  uploadAvatar: (file: File): Promise<{ avatar_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/users/me/avatar', {
      method: 'POST',
      body: formData as any,
    });
  },
};

// ============================================================
// REQUESTS (Missions)
// ============================================================
export interface ServiceRequest {
  id: string;
  client_id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  city: string;
  budget?: number;
  urgency: string;
  status: string;
  material_provided: boolean;
  access_info?: string;
  area_sqm?: number;
  photos?: string[];
  is_public: boolean;
  created_at: string;
}

export const requests = {
  list: (params?: { category?: string; city?: string; urgency?: string; status?: string; limit?: number; offset?: number }): Promise<ServiceRequest[]> => {
    const q = new URLSearchParams();
    if (params?.category) q.append('category', params.category);
    if (params?.city) q.append('city', params.city);
    if (params?.urgency) q.append('urgency', params.urgency);
    if (params?.status) q.append('status', params.status);
    if (params?.limit) q.append('limit', String(params.limit));
    if (params?.offset) q.append('offset', String(params.offset));
    return request(`/requests?${q}`, {}, false);
  },

  mine: (params?: { limit?: number; offset?: number }): Promise<ServiceRequest[]> => {
    const q = new URLSearchParams();
    if (params?.limit) q.append('limit', String(params.limit));
    return request(`/requests/mine?${q}`);
  },

  get: (id: string): Promise<ServiceRequest> => request(`/requests/${id}`, {}, false),

  create: (data: Omit<ServiceRequest, 'id' | 'client_id' | 'status' | 'created_at'>): Promise<ServiceRequest> =>
    request('/requests', { method: 'POST', body: JSON.stringify(data) }),

  update: (id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> =>
    request(`/requests/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: (id: string): Promise<void> =>
    request(`/requests/${id}`, { method: 'DELETE' }),
};

// ============================================================
// PROPOSALS (Devis)
// ============================================================
export interface Proposal {
  id: string;
  request_id: string;
  artisan_id: string;
  price: number;
  labor_cost?: number;
  material_cost?: number;
  delay_days: number;
  message: string;
  status: string;
  refusal_reason?: string;
  created_at: string;
}

export const proposals = {
  create: (data: { request_id: string; price: number; labor_cost?: number; material_cost?: number; delay_days: number; message: string }): Promise<Proposal> =>
    request('/proposals', { method: 'POST', body: JSON.stringify(data) }),

  forRequest: (requestId: string): Promise<Proposal[]> =>
    request(`/proposals/request/${requestId}`),

  mine: (params?: { limit?: number; offset?: number }): Promise<Proposal[]> =>
    request('/proposals/mine'),

  accept: (id: string): Promise<Proposal> =>
    request(`/proposals/${id}/accept`, { method: 'PUT' }),

  refuse: (id: string, reason?: string): Promise<Proposal> =>
    request(`/proposals/${id}/refuse`, { method: 'PUT', body: JSON.stringify({ status: 'refused', refusal_reason: reason || '' }) }),
};

// ============================================================
// PROJECTS
// ============================================================
export interface Project {
  id: string;
  request_id: string;
  proposal_id: string;
  client_id: string;
  artisan_id: string;
  status: string;
  before_photos?: string[];
  after_photos?: string[];
  checklist?: Record<string, boolean>;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export const projects = {
  mine: (): Promise<Project[]> => request('/projects/mine'),
  get: (id: string): Promise<Project> => request(`/projects/${id}`),
  updateChecklist: (id: string, checklist: Record<string, boolean>): Promise<Project> =>
    request(`/projects/${id}/checklist`, { method: 'PUT', body: JSON.stringify(checklist) }),
  addBeforePhotos: (id: string, photos: string[]): Promise<Project> =>
    request(`/projects/${id}/before-photos`, { method: 'POST', body: JSON.stringify(photos) }),
  addAfterPhotos: (id: string, photos: string[]): Promise<Project> =>
    request(`/projects/${id}/after-photos`, { method: 'POST', body: JSON.stringify(photos) }),
  complete: (id: string): Promise<Project> =>
    request(`/projects/${id}/complete`, { method: 'PUT' }),
};

// ============================================================
// REVIEWS
// ============================================================
export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  reply?: string;
  is_public: boolean;
  created_at: string;
}

export const reviews = {
  forUser: (userId: string): Promise<Review[]> =>
    request(`/reviews/user/${userId}`, {}, false),
  forProject: (projectId: string): Promise<Review[]> =>
    request(`/reviews/project/${projectId}`),
  create: (data: { project_id: string; reviewee_id: string; rating: number; comment?: string; is_public?: boolean }): Promise<Review> =>
    request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  reply: (id: string, reply: string): Promise<Review> =>
    request(`/reviews/${id}/reply?reply=${encodeURIComponent(reply)}`, { method: 'PUT' }),
};

// ============================================================
// CHAT
// ============================================================
export interface Chat {
  id: string;
  participants: string[];
  request_id?: string;
  last_message?: string;
  last_message_at?: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export const chat = {
  list: (): Promise<Chat[]> => request('/chat'),
  start: (participant_id: string, request_id?: string): Promise<Chat> =>
    request('/chat/start', { method: 'POST', body: JSON.stringify({ participant_id, request_id }) }),
  getMessages: (chatId: string, limit = 50): Promise<Message[]> =>
    request(`/chat/${chatId}/messages?limit=${limit}`),
  sendMessage: (chatId: string, content: string): Promise<Message> =>
    request(`/chat/${chatId}/messages`, { method: 'POST', body: JSON.stringify({ content }) }),
  markRead: (chatId: string): Promise<void> =>
    request(`/chat/${chatId}/read`, { method: 'PUT' }),
};

// ============================================================
// NOTIFICATIONS
// ============================================================
export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  is_read: boolean;
  created_at: string;
}

export const notifications = {
  list: (limit = 20): Promise<Notification[]> => request(`/notifications?limit=${limit}`),
  markRead: (id: string): Promise<void> => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllRead: (): Promise<void> => request('/notifications/read-all', { method: 'PUT' }),
};

// ============================================================
// ADMIN
// ============================================================
export const admin = {
  getUsers: (params?: { limit?: number; offset?: number }): Promise<UserProfile[]> => {
    const q = new URLSearchParams();
    if (params?.limit) q.append('limit', String(params.limit));
    if (params?.offset) q.append('offset', String(params.offset));
    return request(`/admin/users?${q}`);
  },
  verifyUser: (id: string): Promise<void> => request(`/admin/users/${id}/verify`, { method: 'PUT' }),
  getAllRequests: (params?: { limit?: number; offset?: number }): Promise<ServiceRequest[]> => {
    const q = new URLSearchParams();
    if (params?.limit) q.append('limit', String(params.limit));
    return request(`/admin/requests?${q}`);
  },
  getStats: (): Promise<Record<string, number>> => request('/admin/stats'),
};

// ============================================================
// SUPPORT
// ============================================================
export const support = {
  createTicket: (data: { subject: string; body: string; category: string }): Promise<any> =>
    request('/support', { method: 'POST', body: JSON.stringify(data) }),
  mine: (): Promise<any[]> => request('/support/mine'),
};

export default { auth, users, requests, proposals, projects, reviews, chat, notifications, admin, support, TokenStorage };

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  avatarUrl?: string;
}

export interface Connection {
  id: string;
  email: string;
  username?: string;
  status: 'pending' | 'accepted';
}

export interface Herd {
  id: string;
  name: string;
  members: User[];
  creatorId: string;
}

export interface Reflection {
  id: string;
  author_id: string;
  author?: User; // Optional, populated via join
  high_text?: string;
  low_text?: string;
  buffalo_text?: string;
  high_image_url?: string;
  low_image_url?: string;
  buffalo_image_url?: string;
  audience_type: 'self' | 'user' | 'herd';
  audience_id: string;
  created_at: string;
  reactions?: { id: string; user_id: string; type: 'curiosity' }[];
  reminders?: { id: string; user_id: string }[];
}
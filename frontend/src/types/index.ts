export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Connection {
  id: string;
  user: User;
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
  author: User;
  highText: string;
  lowText: string;
  buffaloText: string;
  audienceType: 'self' | 'user' | 'herd';
  audienceId: string;
  createdAt: string;
  reactions: { userId: string; type: 'curiosity' }[];
}
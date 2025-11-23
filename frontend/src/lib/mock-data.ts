import { User, Reflection, Herd, Connection } from "@/types";

export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Alex',
  email: 'alex@example.com',
  avatarUrl: 'https://github.com/shadcn.png',
};

export const mockUsers: User[] = [
  mockCurrentUser,
  { id: 'user-2', name: 'Chloe', email: 'chloe@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=user-2' },
  { id: 'user-3', name: 'Robert', email: 'robert@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=user-3' },
  { id: 'user-4', name: 'Maria', email: 'maria@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=user-4' },
  { id: 'user-5', name: 'David', email: 'david@example.com', avatarUrl: 'https://i.pravatar.cc/150?u=user-5' },
];

export const mockConnections: Connection[] = [
    { id: 'conn-1', user: mockUsers[1], status: 'accepted' },
    { id: 'conn-2', user: mockUsers[2], status: 'accepted' },
];

export const mockPendingConnections: Connection[] = [
    { id: 'conn-3', user: mockUsers[3], status: 'pending' },
    { id: 'conn-4', user: mockUsers[4], status: 'pending' },
];

export const mockHerds: Herd[] = [
    { id: 'herd-1', name: 'Miller Family', members: [mockCurrentUser, mockUsers[2]], creatorId: 'user-1' },
    { id: 'herd-2', name: 'Book Club', members: [mockCurrentUser, mockUsers[1], mockUsers[3]], creatorId: 'user-2' },
];

export const mockReflections: Reflection[] = [
  {
    id: 'refl-1',
    author: mockUsers[2], // Robert
    highText: "Had a lovely video call with my grandkids. They showed me their new puppy!",
    lowText: "My favorite coffee shop was closed for renovations today.",
    buffaloText: "A deer walked right through my backyard this morning. So unexpected!",
    audienceType: 'herd',
    audienceId: 'herd-1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: [{ userId: 'user-1', type: 'curiosity' }],
  },
  {
    id: 'refl-2',
    author: mockUsers[1], // Chloe
    highText: "Aced my midterm exam! All that studying paid off.",
    lowText: "Feeling a bit homesick this week.",
    buffaloText: "Discovered a hidden path on campus that leads to a beautiful little garden.",
    audienceType: 'user',
    audienceId: 'user-1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: [],
  },
  {
    id: 'refl-3',
    author: mockCurrentUser, // Alex
    highText: "My daughter scored the winning goal in her soccer game. I was so proud.",
    lowText: "Work was incredibly stressful today, long meetings and tight deadlines.",
    buffaloText: "I tried a new recipe for dinner and it was actually a huge success!",
    audienceType: 'self',
    audienceId: 'user-1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: [],
  },
];
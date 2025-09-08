export interface User {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  avatar?: string;
  createdAt: string;
}

export interface JobReview {
  id: string;
  title: string;
  company: string;
  position: string;
  salary?: string;
  content: string;
  tags: string[];
  author: User;
  likes: number;
  bookmarks: number;
  createdAt: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  university: string;
  major: string;
}
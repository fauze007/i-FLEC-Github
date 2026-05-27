export interface User {
  email: string;
  name: string;
  avatarUrl: string;
  streak: number;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  progress: number;
}

export interface Badge {
  id: string;
  name: string;
  date: string;
  desc: string;
  icon: string;
  locked: boolean;
  color: 'primary' | 'tertiary';
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quote?: string;
  correction?: {
    error: string;
    fix: string;
  };
  hasStats?: boolean;
  accuracy?: number;
  fluency?: number;
  nextPrompt?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export enum LeeraModelMode {
  STANDARD = 'Standard',
  PROGRAMMING = 'Programming Expert',
}
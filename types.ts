export enum AppView {
  HOME = 'HOME',
  STUDY_HUB = 'STUDY_HUB',
  CAREER_COACH = 'CAREER_COACH',
  EXAM_PREP = 'EXAM_PREP',
  CHAT_BOT = 'CHAT_BOT',
  AI_TOOLS = 'AI_TOOLS'
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export interface StudyTopic {
  subject: string;
  topic: string;
  level: string; // e.g., 'Class 10', 'University', 'Entrance'
}

export interface CareerProfile {
  name: string;
  skills: string;
  targetRole: string;
  experienceLevel: string;
}

export interface ExamConfig {
  examName: string; // e.g., JEE, UPSC, SSC
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  type: 'Govt' | 'Private';
  location: string;
  salary: string;
  posted: string;
  tags: string[];
  applyLink?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}
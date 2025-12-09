export enum AppView {
  HOME = 'HOME',
  ATTENDANCE = 'ATTENDANCE',
  CGPA = 'CGPA',
  TASKS = 'TASKS',
  NOTES = 'NOTES'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
}
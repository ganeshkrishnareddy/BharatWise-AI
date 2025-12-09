import { Task, Note } from '../types';

// ==========================================
// NEON DATABASE INTEGRATION (Server-Side)
// ==========================================
// Instructions:
// 1. Install dependencies: npm install @netlify/neon
// 2. Ensure NETLIFY_DATABASE_URL is set in your environment variables
// 3. This code is intended for use in Netlify Functions or a Node.js backend.
//    Browsers cannot directly run this securely.

/*
import { neon } from '@netlify/neon';

// Automatically uses env NETLIFY_DATABASE_URL
const sql = neon(); 

export const neonDb = {
  async getTasks(): Promise<Task[]> {
    const rows = await sql`SELECT * FROM tasks ORDER BY created_at DESC`;
    return rows.map(row => ({
      id: row.id,
      text: row.text,
      completed: row.completed,
      priority: row.priority,
      createdAt: Number(row.created_at)
    }));
  },

  async addTask(task: Task) {
    await sql`
      INSERT INTO tasks (id, text, completed, priority, created_at)
      VALUES (${task.id}, ${task.text}, ${task.completed}, ${task.priority}, ${task.createdAt})
    `;
  },

  async updateTask(task: Task) {
    await sql`
      UPDATE tasks 
      SET completed = ${task.completed}, text = ${task.text}
      WHERE id = ${task.id}
    `;
  },

  async deleteTask(id: string) {
    await sql`DELETE FROM tasks WHERE id = ${id}`;
  },

  async getNotes(): Promise<Note[]> {
    const rows = await sql`SELECT * FROM notes ORDER BY updated_at DESC`;
    return rows.map(row => ({
      id: row.id,
      title: row.title,
      content: row.content,
      updatedAt: Number(row.updated_at)
    }));
  },

  async saveNote(note: Note) {
    await sql`
      INSERT INTO notes (id, title, content, updated_at)
      VALUES (${note.id}, ${note.title}, ${note.content}, ${note.updatedAt})
      ON CONFLICT (id) DO UPDATE 
      SET title = EXCLUDED.title, 
          content = EXCLUDED.content, 
          updated_at = EXCLUDED.updated_at
    `;
  },

  async deleteNote(id: string) {
    await sql`DELETE FROM notes WHERE id = ${id}`;
  }
};
*/

// ==========================================
// LOCAL STORAGE ADAPTER (Client-Side)
// ==========================================
// This handles data persistence in the browser for the immediate demo.

const KEYS = {
  TASKS: 'bw_tasks',
  NOTES: 'bw_notes'
};

// Simulate async API calls to prepare UI for database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const storageService = {
  // --- Tasks ---
  async getTasks(): Promise<Task[]> {
    await delay(100); // Simulate network
    const saved = localStorage.getItem(KEYS.TASKS);
    return saved ? JSON.parse(saved) : [];
  },

  async saveTask(task: Task): Promise<void> {
    await delay(50);
    const tasks = await this.getTasks();
    const exists = tasks.find(t => t.id === task.id);
    let newTasks;
    if (exists) {
      newTasks = tasks.map(t => t.id === task.id ? task : t);
    } else {
      newTasks = [...tasks, task];
    }
    localStorage.setItem(KEYS.TASKS, JSON.stringify(newTasks));
  },

  async deleteTask(id: string): Promise<void> {
    await delay(50);
    const tasks = await this.getTasks();
    const newTasks = tasks.filter(t => t.id !== id);
    localStorage.setItem(KEYS.TASKS, JSON.stringify(newTasks));
  },

  // --- Notes ---
  async getNotes(): Promise<Note[]> {
    await delay(100);
    const saved = localStorage.getItem(KEYS.NOTES);
    return saved ? JSON.parse(saved) : [];
  },

  async saveNote(note: Note): Promise<void> {
    await delay(50);
    const notes = await this.getNotes();
    const exists = notes.find(n => n.id === note.id);
    let newNotes;
    if (exists) {
      newNotes = notes.map(n => n.id === note.id ? note : n);
    } else {
      newNotes = [note, ...notes];
    }
    localStorage.setItem(KEYS.NOTES, JSON.stringify(newNotes));
  },

  async deleteNote(id: string): Promise<void> {
    await delay(50);
    const notes = await this.getNotes();
    const newNotes = notes.filter(n => n.id !== id);
    localStorage.setItem(KEYS.NOTES, JSON.stringify(newNotes));
  }
};
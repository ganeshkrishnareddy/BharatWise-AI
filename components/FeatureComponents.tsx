import React, { useState, useEffect, useRef } from 'react';
import { 
  CalendarCheck, UserCheck, AlertCircle, Plus, Trash2, 
  Check, ListTodo, StickyNote, Save, Clock, X, Circle, CheckCircle, Loader2
} from 'lucide-react';
import { Task, Note } from '../types';
import { storageService } from '../services/storage';

// --- Attendance Tool ---
export const AttendanceTool = () => {
  const [total, setTotal] = useState('');
  const [attended, setAttended] = useState('');
  const [target, setTarget] = useState('75');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const t = parseInt(total);
    const a = parseInt(attended);
    const tg = parseInt(target);

    if (isNaN(t) || isNaN(a) || isNaN(tg) || t === 0) {
      alert("Please enter valid numbers.");
      return;
    }

    const currentPercent = (a / t) * 100;
    let status = '';
    let message = '';
    let subMessage = '';

    if (currentPercent >= tg) {
      const bunkable = Math.floor(((100 * a) - (tg * t)) / tg);
      status = 'safe';
      message = `You are Safe! Current: ${currentPercent.toFixed(2)}%`;
      subMessage = bunkable > 0 
        ? `You can bunk ${bunkable} more classes and still maintain ${tg}%.` 
        : `You are on track but cannot bunk any classes right now.`;
    } else {
      const needed = Math.ceil(((tg * t) - (100 * a)) / (100 - tg));
      status = 'danger';
      message = `Low Attendance! Current: ${currentPercent.toFixed(2)}%`;
      subMessage = `You need to attend ${needed} classes continuously to reach ${tg}%.`;
    }

    setResult({ status, message, subMessage });
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <CalendarCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Attendance Calculator</h2>
            <p className="text-purple-100">Bunk safely or catch up efficiently.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Classes Conducted</label>
            <input 
              type="number" 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="e.g. 50"
              value={total}
              onChange={e => setTotal(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Classes Attended</label>
            <input 
              type="number" 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="e.g. 40"
              value={attended}
              onChange={e => setAttended(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Percentage (%)</label>
            <input 
              type="number" 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="e.g. 75"
              value={target}
              onChange={e => setTarget(e.target.value)}
            />
          </div>
        </div>
        
        <button 
          onClick={calculate}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          Calculate Status
        </button>

        {result && (
          <div className={`mt-6 p-6 rounded-xl border-l-4 ${result.status === 'safe' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'} animate-fade-in`}>
            <div className="flex items-center gap-3 mb-2">
              {result.status === 'safe' ? <UserCheck size={24} /> : <AlertCircle size={24} />}
              <h3 className="text-xl font-bold">{result.message}</h3>
            </div>
            <p className="text-lg opacity-90">{result.subMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// --- CGPA Calculator Component ---
export const CgpaCalculator = () => {
  const [activeTab, setActiveTab] = useState<'calculator' | 'predictor'>('calculator');
  const gradePoints: Record<string, number> = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'D': 4, 'E': 0, 'F': 0, 'I': 0
  };

  type Course = { id: number; name: string; credits: number; grade: string };
  type Semester = { id: number; courses: Course[] };
  const [semesters, setSemesters] = useState<Semester[]>([
    { id: 1, courses: [{ id: 1, name: 'Course 1', credits: 4, grade: 'O' }] }
  ]);

  const addSemester = () => {
    setSemesters([...semesters, { id: semesters.length + 1, courses: [{ id: 1, name: 'Course 1', credits: 4, grade: 'A+' }] }]);
  };

  const addCourse = (semId: number) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          courses: [...sem.courses, { id: sem.courses.length + 1, name: `Course ${sem.courses.length + 1}`, credits: 3, grade: 'A' }]
        };
      }
      return sem;
    }));
  };

  const updateCourse = (semId: number, courseId: number, field: 'credits' | 'grade', value: string | number) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          courses: sem.courses.map(c => c.id === courseId ? { ...c, [field]: value } : c)
        };
      }
      return sem;
    }));
  };

  const removeCourse = (semId: number, courseId: number) => {
    setSemesters(semesters.map(sem => {
      if (sem.id === semId) {
        return { ...sem, courses: sem.courses.filter(c => c.id !== courseId) };
      }
      return sem;
    }));
  };

  const calculateSemesterStats = (sem: Semester) => {
    let totalCredits = 0;
    let totalPoints = 0;
    sem.courses.forEach(c => {
      totalCredits += Number(c.credits);
      totalPoints += Number(c.credits) * (gradePoints[c.grade] || 0);
    });
    return {
      tgpa: totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00',
      credits: totalCredits
    };
  };

  const overallStats = (() => {
    let totalCredits = 0;
    let totalPoints = 0;
    semesters.forEach(sem => {
      sem.courses.forEach(c => {
        totalCredits += Number(c.credits);
        totalPoints += Number(c.credits) * (gradePoints[c.grade] || 0);
      });
    });
    const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    return { cgpa, percentage: (Number(cgpa) * 10).toFixed(1), totalCredits };
  })();

  const [currentCgpa, setCurrentCgpa] = useState('');
  const [completedCredits, setCompletedCredits] = useState('');
  const [targetCgpa, setTargetCgpa] = useState('');
  const [remainingCredits, setRemainingCredits] = useState('');
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  const calculatePrediction = () => {
    const curCgpa = parseFloat(currentCgpa);
    const compCreds = parseFloat(completedCredits);
    const tarCgpa = parseFloat(targetCgpa);
    const remCreds = parseFloat(remainingCredits);

    if (!curCgpa || !compCreds || !tarCgpa || !remCreds) {
      setPredictionResult("Please fill all fields.");
      return;
    }

    const currentPoints = curCgpa * compCreds;
    const totalCredits = compCreds + remCreds;
    const requiredTotalPoints = tarCgpa * totalCredits;
    const requiredRemainingPoints = requiredTotalPoints - currentPoints;
    const requiredGpa = requiredRemainingPoints / remCreds;

    if (requiredGpa > 10) {
      setPredictionResult(`Impossible! You would need a GPA of ${requiredGpa.toFixed(2)} in remaining credits (Max is 10).`);
    } else if (requiredGpa < 0) {
      setPredictionResult(`You already have enough points! Even with 0 GPA, you'd be above target.`);
    } else {
      setPredictionResult(`You need an average GPA of ${requiredGpa.toFixed(2)} in your remaining ${remCreds} credits.`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
       <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Check size={32} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">CGPA Calculator</h2>
            <p className="text-emerald-100">Track your grades and predict future scores.</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'calculator'
              ? 'bg-emerald-100 text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          CGPA Calculator
        </button>
        <button
          onClick={() => setActiveTab('predictor')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'predictor'
              ? 'bg-emerald-100 text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
          }`}
        >
          Grade Predictor
        </button>
      </div>

      {activeTab === 'calculator' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-slate-500 text-sm font-medium uppercase mb-1">Current CGPA</div>
              <div className="text-4xl font-bold text-slate-800">{overallStats.cgpa}</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-slate-500 text-sm font-medium uppercase mb-1">Percentage</div>
              <div className="text-4xl font-bold text-blue-600">{overallStats.percentage}%</div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-slate-500 text-sm font-medium uppercase mb-1">Total Credits</div>
              <div className="text-4xl font-bold text-emerald-600">{overallStats.totalCredits}</div>
            </div>
          </div>

          {semesters.map((sem, sIdx) => {
            const stats = calculateSemesterStats(sem);
            return (
              <div key={sem.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="font-bold text-slate-700">Semester {sIdx + 1}</h3>
                  <div className="flex gap-4 text-sm">
                    <span className="font-semibold text-slate-600">Credits: {stats.credits}</span>
                    <span className="font-bold text-primary">TGPA: {stats.tgpa}</span>
                  </div>
                </div>
                <div className="p-6 space-y-3">
                  <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-slate-500 uppercase px-2">
                    <div className="col-span-1">#</div>
                    <div className="col-span-5">Course Name</div>
                    <div className="col-span-2">Credits</div>
                    <div className="col-span-3">Grade</div>
                    <div className="col-span-1"></div>
                  </div>
                  {sem.courses.map((course, cIdx) => (
                    <div key={course.id} className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-1 text-slate-400 font-mono">{cIdx + 1}</div>
                      <div className="col-span-5">
                        <input 
                          type="text" 
                          className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-green-500 outline-none text-sm"
                          value={course.name}
                          readOnly 
                          placeholder="Course Name"
                        />
                      </div>
                      <div className="col-span-2">
                         <input 
                          type="number" 
                          min="0"
                          className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-green-500 outline-none text-sm"
                          value={course.credits}
                          onChange={(e) => updateCourse(sem.id, course.id, 'credits', parseFloat(e.target.value))}
                        />
                      </div>
                      <div className="col-span-3">
                        <select 
                          className="w-full p-2 border border-slate-200 rounded focus:ring-1 focus:ring-green-500 outline-none text-sm bg-white"
                          value={course.grade}
                          onChange={(e) => updateCourse(sem.id, course.id, 'grade', e.target.value)}
                        >
                          {Object.keys(gradePoints).map(g => (
                            <option key={g} value={g}>{g} ({gradePoints[g]})</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button 
                          onClick={() => removeCourse(sem.id, course.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  <button 
                    onClick={() => addCourse(sem.id)}
                    className="mt-2 text-sm text-green-600 font-semibold hover:text-green-700 flex items-center gap-1"
                  >
                    <Plus size={16} /> Add Course
                  </button>
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={addSemester}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-green-500 hover:text-green-600 font-semibold transition-all flex justify-center items-center gap-2"
          >
            <Plus size={20} /> Add Next Semester
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-xl shadow-md border border-slate-200 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Future Grade Predictor</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current CGPA</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. 7.35"
                  value={currentCgpa}
                  onChange={e => setCurrentCgpa(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Credits Completed</label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. 120"
                  value={completedCredits}
                  onChange={e => setCompletedCredits(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target CGPA Goal</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. 8.0"
                  value={targetCgpa}
                  onChange={e => setTargetCgpa(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Credits Remaining</label>
                <input 
                  type="number" 
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                  placeholder="e.g. 40"
                  value={remainingCredits}
                  onChange={e => setRemainingCredits(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              onClick={calculatePrediction}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Calculate Required GPA
            </button>

            {predictionResult && (
              <div className={`p-4 rounded-xl text-center font-bold text-lg ${predictionResult.includes("Impossible") ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}`}>
                {predictionResult}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Task Manager ---
export const TaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await storageService.getTasks();
      setTasks(data);
    } catch (e) {
      console.error("Failed to load tasks", e);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task: Task = {
      id: Date.now().toString(),
      text: newTask,
      completed: false,
      priority,
      createdAt: Date.now()
    };

    setTasks(prev => [task, ...prev]); // Optimistic update
    setNewTask('');
    await storageService.saveTask(task);
    loadTasks(); // Refresh to sync
  };

  const toggleTask = async (task: Task) => {
    const updated = { ...task, completed: !task.completed };
    setTasks(tasks.map(t => t.id === task.id ? updated : t)); // Optimistic
    await storageService.saveTask(updated);
  };

  const deleteTask = async (id: string) => {
    setTasks(tasks.filter(t => t.id !== id)); // Optimistic
    await storageService.deleteTask(id);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <ListTodo className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Task Manager</h2>
            <p className="text-blue-100">Organize your assignments and study goals.</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-100 mb-6">
        <form onSubmit={addTask} className="flex flex-col md:flex-row gap-3">
          <input 
            type="text"
            className="flex-grow p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
          />
          <select 
            className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={priority}
            onChange={(e: any) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Add Task'}
          </button>
        </form>
      </div>

      <div className="space-y-3">
        {loading && tasks.length === 0 && (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
            <p className="text-slate-400 mt-2">Loading tasks...</p>
          </div>
        )}
        
        {!loading && tasks.length === 0 && (
          <div className="text-center text-slate-500 py-8 bg-white rounded-xl border border-slate-200 border-dashed">
            No tasks yet. Start planning your success!
          </div>
        )}

        {tasks.sort((a, b) => b.createdAt - a.createdAt).map(task => (
          <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${task.completed ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => toggleTask(task)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-green-500'}`}
              >
                <Check size={14} />
              </button>
              <div>
                <p className={`font-medium ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                  {task.text}
                </p>
                <div className="flex gap-2 items-center text-xs mt-1">
                  <span className={`px-2 py-0.5 rounded-full ${
                    task.priority === 'High' ? 'bg-red-100 text-red-700' : 
                    task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </span>
                  <span className="text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => deleteTask(task.id)}
              className="text-slate-400 hover:text-red-500 p-2"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Quick Notes ---
export const QuickNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  
  // Editor State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  // Debounce saving
  const saveTimeoutRef = useRef<any>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await storageService.getNotes();
      setNotes(data);
    } catch(e) { console.error(e); } 
    finally { setLoading(false); }
  };

  const createNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now()
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    setTitle(newNote.title);
    setContent(newNote.content);
    storageService.saveNote(newNote); // Save immediately
  };

  const selectNote = (note: Note) => {
    setActiveNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleSave = () => {
    if (!activeNoteId) return;
    
    const updatedNote = {
      id: activeNoteId,
      title,
      content,
      updatedAt: Date.now()
    };

    setNotes(notes.map(n => n.id === activeNoteId ? updatedNote : n));
    storageService.saveNote(updatedNote);
  };

  const deleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotes(notes.filter(n => n.id !== id));
    if (activeNoteId === id) {
      setActiveNoteId(null);
      setTitle('');
      setContent('');
    }
    await storageService.deleteNote(id);
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex gap-6 animate-fade-in">
      {/* Sidebar List */}
      <div className="w-1/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <StickyNote size={20} className="text-amber-500"/> My Notes
          </h3>
          <button 
            onClick={createNote}
            className="bg-amber-500 hover:bg-amber-600 text-white p-2 rounded-lg transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-2 space-y-1">
          {loading && <div className="text-center p-4 text-slate-400"><Loader2 className="animate-spin inline" /></div>}
          
          {!loading && notes.length === 0 && (
            <div className="text-center text-slate-400 p-8 text-sm">No notes created yet.</div>
          )}
          
          {notes.map(note => (
            <div 
              key={note.id}
              onClick={() => selectNote(note)}
              className={`p-3 rounded-lg cursor-pointer group flex justify-between items-start ${activeNoteId === note.id ? 'bg-amber-50 border border-amber-200' : 'hover:bg-slate-50 border border-transparent'}`}
            >
              <div>
                <h4 className={`font-semibold text-sm truncate w-32 ${activeNoteId === note.id ? 'text-amber-800' : 'text-slate-700'}`}>{note.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{new Date(note.updatedAt).toLocaleDateString()}</p>
              </div>
              <button 
                onClick={(e) => deleteNote(e, note.id)}
                className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor Area */}
      <div className="w-2/3 bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden">
        {activeNoteId ? (
          <>
            <div className="p-4 border-b border-slate-100 flex gap-4 items-center">
              <input 
                type="text"
                className="flex-grow text-xl font-bold text-slate-800 outline-none bg-transparent"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onBlur={handleSave}
                placeholder="Note Title"
              />
              <div className="text-xs text-slate-400 flex items-center gap-1">
                <Clock size={12} /> {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
              <button 
                onClick={handleSave}
                className="text-emerald-600 hover:bg-emerald-50 p-2 rounded-lg transition-colors"
                title="Save"
              >
                <Save size={20} />
              </button>
            </div>
            <textarea 
              className="flex-grow p-6 outline-none resize-none text-slate-700 leading-relaxed"
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={handleSave}
              placeholder="Start typing your notes here..."
            />
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400">
            <StickyNote size={64} className="mb-4 opacity-20" />
            <p>Select a note or create a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};
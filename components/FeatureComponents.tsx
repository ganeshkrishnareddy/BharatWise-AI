import React, { useState, useRef, useEffect } from 'react';
import { 
  generateStudyNotes, 
  generateCareerAdvice, 
  generateExamQuestions,
  generateRoadmap,
  generateEssay,
  generateProject,
  debugCode,
  summarizeText,
  fetchJobListings
} from '../services/geminiService';
import { JobPosting, QuizQuestion } from '../types';
import { 
  Loader2, BookOpen, Briefcase, GraduationCap, Copy, Check, FileText, 
  Calculator, Plus, Trash2, Map, PenTool, Bug, FileOutput, ArrowLeft,
  CalendarCheck, UserCheck, AlertCircle, Bell, RefreshCw, Building2, Landmark,
  ExternalLink, ChevronRight, RotateCcw
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ResponseDisplay = ({ content }: { content: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!content) return null;

  return (
    <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden animate-fade-in">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex justify-between items-center">
        <span className="text-sm font-semibold text-slate-600">AI Generated Result</span>
        <button 
          onClick={handleCopy}
          className="text-slate-500 hover:text-primary transition-colors flex items-center gap-1 text-xs uppercase font-bold tracking-wider"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="p-6 overflow-auto max-h-[500px] bg-white">
        <article className="prose prose-slate max-w-none prose-headings:text-slate-800 prose-p:text-slate-700 prose-li:text-slate-700 prose-strong:text-slate-900 prose-strong:font-bold">
          <ReactMarkdown>{content}</ReactMarkdown>
        </article>
      </div>
    </div>
  );
};

// --- Attendance Tool ---
const AttendanceTool = () => {
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
    <div className="max-w-2xl mx-auto">
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
      {/* Tabs */}
      <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'calculator'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : 'text-slate-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          CGPA Calculator
        </button>
        <button
          onClick={() => setActiveTab('predictor')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all ${
            activeTab === 'predictor'
              ? 'bg-green-100 text-green-700 shadow-sm'
              : 'text-slate-600 hover:text-green-600 hover:bg-green-50'
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
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
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

// --- New AI Tools Components ---

const SimpleToolForm = ({ 
  title, 
  icon: Icon, 
  color, 
  fields, 
  onSubmit, 
  result, 
  loading 
}: any) => {
  const [inputs, setInputs] = useState<Record<string, string>>({});

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
       <div className={`bg-gradient-to-r ${color} rounded-2xl p-8 text-white mb-8 shadow-lg`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <p className="text-white/90 opacity-90">Powered by AI</p>
          </div>
        </div>
      </div>

      <form 
        onSubmit={(e) => { e.preventDefault(); onSubmit(inputs); }}
        className="bg-white p-6 rounded-xl shadow-md border border-slate-100 space-y-4"
      >
        {fields.map((field: any) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-slate-700 mb-1">{field.label}</label>
            {field.type === 'textarea' ? (
              <textarea
                required={field.required}
                rows={field.rows || 4}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none font-mono text-sm"
                placeholder={field.placeholder}
                value={inputs[field.key] || ''}
                onChange={e => setInputs({...inputs, [field.key]: e.target.value})}
              />
            ) : (
              <input
                type={field.type || 'text'}
                required={field.required}
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder={field.placeholder}
                value={inputs[field.key] || ''}
                onChange={e => setInputs({...inputs, [field.key]: e.target.value})}
              />
            )}
          </div>
        ))}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Icon size={20} />}
          {loading ? 'Generating...' : `Generate ${title.split(' ')[0]}`}
        </button>
      </form>
      
      <ResponseDisplay content={result} />
    </div>
  );
};

export const AiToolsDashboard = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const tools = [
    { id: 'attendance', name: 'Attendance Calc', icon: CalendarCheck, color: 'bg-purple-500', desc: 'Track attendance & safe bunks.' },
    { id: 'roadmap', name: 'Roadmaps', icon: Map, color: 'bg-indigo-500', desc: 'Step-by-step learning paths.' },
    { id: 'cgpa', name: 'CGPA Calc', icon: Calculator, color: 'bg-green-500', desc: 'Calculate & predict grades.' },
    { id: 'essay', name: 'Essay Writer', icon: PenTool, color: 'bg-pink-500', desc: 'Drafts essays on any topic.' },
    { id: 'project', name: 'Project Builder', icon: FileOutput, color: 'bg-blue-500', desc: 'Plan apps & folder structures.' },
    { id: 'debug', name: 'Code Debugger', icon: Bug, color: 'bg-red-500', desc: 'Fix errors & explain logic.' },
    { id: 'summary', name: 'Summarizer', icon: FileText, color: 'bg-amber-500', desc: 'Summarize text or notes.' },
    { id: 'notes', name: 'Lecture Notes', icon: BookOpen, color: 'bg-teal-500', desc: 'Convert transcript to notes.' },
  ];

  const handleToolSubmit = async (toolId: string, data: any) => {
    setLoading(true);
    setResult('');
    try {
      let res = '';
      switch (toolId) {
        case 'roadmap': res = await generateRoadmap(data.goal, data.duration); break;
        case 'essay': res = await generateEssay(data.topic, data.tone || 'Academic'); break;
        case 'project': res = await generateProject(data.stack, data.idea); break;
        case 'debug': res = await debugCode(data.code, data.error); break;
        case 'summary': res = await summarizeText(data.text, 'summary'); break;
        case 'notes': res = await summarizeText(data.text, 'notes'); break;
      }
      setResult(res);
    } catch (e) {
      setResult("Error generating content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!activeTool) {
    return (
      <div className="max-w-5xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800">AI Productivity Tools</h2>
          <p className="text-slate-600 mt-2">Select a tool to boost your productivity</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <div 
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 ${tool.color.replace('bg-', 'bg-').replace('500', '100')} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                <tool.icon className={`w-6 h-6 ${tool.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{tool.name}</h3>
              <p className="text-sm text-slate-500 mt-1">{tool.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render Specific Tool
  if (activeTool === 'cgpa') {
    return (
      <div className="space-y-4">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4">
          <ArrowLeft size={18} /> Back to Tools
        </button>
        <CgpaCalculator />
      </div>
    );
  }
  
  if (activeTool === 'attendance') {
     return (
      <div className="space-y-4">
        <button onClick={() => setActiveTool(null)} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4">
          <ArrowLeft size={18} /> Back to Tools
        </button>
        <AttendanceTool />
      </div>
    );
  }

  const toolConfig: any = {
    roadmap: {
      title: 'Learning Roadmap Generator', icon: Map, color: 'from-indigo-600 to-blue-600',
      fields: [
        { key: 'goal', label: 'What do you want to learn?', placeholder: 'e.g. Become a Full Stack Developer', required: true },
        { key: 'duration', label: 'Time available?', placeholder: 'e.g. 3 months, 2 hours/day', required: true }
      ]
    },
    essay: {
      title: 'Smart Essay Writer', icon: PenTool, color: 'from-pink-600 to-rose-600',
      fields: [
        { key: 'topic', label: 'Essay Topic', placeholder: 'e.g. Impact of AI on Education', required: true },
        { key: 'tone', label: 'Writing Tone', placeholder: 'e.g. Academic, Persuasive, Casual' }
      ]
    },
    project: {
      title: 'AI Project Architect', icon: FileOutput, color: 'from-blue-600 to-cyan-600',
      fields: [
        { key: 'idea', label: 'Project Idea', placeholder: 'e.g. E-commerce app for local artisans', required: true },
        { key: 'stack', label: 'Tech Stack', placeholder: 'e.g. React, Node.js, MongoDB', required: true }
      ]
    },
    debug: {
      title: 'Code Debugger', icon: Bug, color: 'from-red-600 to-orange-600',
      fields: [
        { key: 'code', label: 'Paste Code Snippet', type: 'textarea', placeholder: '// Your code here...', required: true, rows: 8 },
        { key: 'error', label: 'Error Message (Optional)', placeholder: 'e.g. undefined is not a function' }
      ]
    },
    summary: {
      title: 'Text Summarizer', icon: FileText, color: 'from-amber-500 to-yellow-600',
      fields: [
        { key: 'text', label: 'Text to Summarize', type: 'textarea', placeholder: 'Paste article or paragraph...', required: true, rows: 10 }
      ]
    },
    notes: {
      title: 'Lecture Notes Generator', icon: BookOpen, color: 'from-teal-500 to-emerald-600',
      fields: [
        { key: 'text', label: 'Lecture Transcript', type: 'textarea', placeholder: 'Paste lecture transcript here...', required: true, rows: 10 }
      ]
    }
  };

  const config = toolConfig[activeTool];

  return (
    <div className="space-y-4">
      <button onClick={() => { setActiveTool(null); setResult(''); }} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium px-4">
        <ArrowLeft size={18} /> Back to Tools
      </button>
      <SimpleToolForm 
        {...config}
        loading={loading}
        result={result}
        onSubmit={(data: any) => handleToolSubmit(activeTool, data)}
      />
    </div>
  );
};

// --- Study Hub Component ---
export const StudyHub = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [formData, setFormData] = useState({ subject: '', topic: '', level: 'University' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult('');
    try {
      const data = await generateStudyNotes(formData.subject, formData.topic, formData.level);
      setResult(data);
    } catch (err) {
      setResult("Error generating notes. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Smart Study Notes</h2>
            <p className="text-blue-100">Get concise, structured notes for any subject instantly.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
          <input 
            type="text" 
            required
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            placeholder="e.g. Physics, History, Computer Science"
            value={formData.subject}
            onChange={e => setFormData({...formData, subject: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Specific Topic</label>
          <input 
            type="text" 
            required
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Thermodynamics, Mughal Empire"
            value={formData.topic}
            onChange={e => setFormData({...formData, topic: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Level</label>
          <select 
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            value={formData.level}
            onChange={e => setFormData({...formData, level: e.target.value})}
          >
            <option>Class 9-10 (CBSE/ICSE)</option>
            <option>Class 11-12 (Science)</option>
            <option>Class 11-12 (Commerce/Arts)</option>
            <option>University / College</option>
            <option>Competitive Exam Prep</option>
          </select>
        </div>
        <div className="md:col-span-2 mt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin" /> : <BookOpen size={20} />}
            {loading ? 'Generating Notes...' : 'Generate Notes'}
          </button>
        </div>
      </form>

      <ResponseDisplay content={result} />
    </div>
  );
};

// --- Exam Prep Component ---
export const ExamPrep = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ exam: '', topic: '', difficulty: 'Medium' });
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setQuestions([]);
    try {
      const data = await generateExamQuestions(formData.exam, formData.topic, formData.difficulty, questionCount);
      setQuestions(data);
      if (data.length > 0) {
        setQuizStarted(true);
        setCurrentQuestionIndex(0);
        setScore(0);
        resetQuestionState();
      } else {
        alert("Could not generate questions. Please try again.");
      }
    } catch (err) {
      alert("Error generating questions. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const resetQuestionState = () => {
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      // End of quiz
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuestions([]);
    setScore(0);
    setCurrentQuestionIndex(0);
    resetQuestionState();
  };

  const getGradeInfo = (score: number, total: number) => {
    if (total === 0) return { grade: 'I', label: 'Incomplete', color: 'text-slate-500' };
    const percentage = Math.round((score / total) * 100);

    if (percentage === 100) return { grade: 'O', label: 'Outstanding', color: 'text-emerald-600' };
    if (percentage >= 90) return { grade: 'A+', label: 'Excellent', color: 'text-green-600' };
    if (percentage >= 80) return { grade: 'A', label: 'Very Good', color: 'text-lime-600' };
    if (percentage >= 70) return { grade: 'B+', label: 'Good', color: 'text-yellow-600' };
    if (percentage >= 60) return { grade: 'B', label: 'Above Average', color: 'text-amber-600' };
    if (percentage >= 50) return { grade: 'C', label: 'Average', color: 'text-orange-500' };
    if (percentage >= 40) return { grade: 'D', label: 'Marginal', color: 'text-orange-600' };
    return { grade: 'F', label: 'Fail', color: 'text-red-600' };
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Exam Prep & Mock Tests</h2>
            <p className="text-amber-100">Practice for JEE, NEET, UPSC, SSC, or University Exams.</p>
          </div>
        </div>
      </div>

      {!quizStarted ? (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="e.g. JEE Mains, UPSC, Semester Final"
              value={formData.exam}
              onChange={e => setFormData({...formData, exam: e.target.value})}
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Difficulty</label>
            <select 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              value={formData.difficulty}
              onChange={e => setFormData({...formData, difficulty: e.target.value})}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Topic / Subject</label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
              placeholder="e.g. Organic Chemistry, Indian Polity, Data Structures"
              value={formData.topic}
              onChange={e => setFormData({...formData, topic: e.target.value})}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Questions</label>
            <select 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none bg-white"
              value={questionCount}
              onChange={e => setQuestionCount(parseInt(e.target.value))}
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={15}>15 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>

          <div className="md:col-span-2 mt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-lg transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" /> : <GraduationCap size={20} />}
              {loading ? 'Generating Questions...' : 'Create Mock Test'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6 animate-fade-in">
          {currentQuestionIndex < questions.length ? (
            <>
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Card */}
              <div className="bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-bold text-amber-600 uppercase tracking-wide">Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span className="text-sm font-medium text-slate-500">Score: {score}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{questions[currentQuestionIndex].question}</h3>
                </div>

                <div className="p-6 space-y-3">
                   {questions[currentQuestionIndex].options.map((option, idx) => {
                     let btnClass = "w-full p-4 text-left border rounded-lg transition-all font-medium text-slate-700 hover:bg-slate-50 border-slate-200";
                     
                     if (isAnswered) {
                        if (idx === questions[currentQuestionIndex].correctAnswerIndex) {
                          btnClass = "w-full p-4 text-left border rounded-lg font-medium bg-green-50 border-green-500 text-green-700";
                        } else if (idx === selectedOption) {
                          btnClass = "w-full p-4 text-left border rounded-lg font-medium bg-red-50 border-red-500 text-red-700";
                        } else {
                          btnClass = "w-full p-4 text-left border rounded-lg font-medium text-slate-400 border-slate-100 opacity-60";
                        }
                     }

                     return (
                       <button
                         key={idx}
                         onClick={() => handleOptionSelect(idx)}
                         disabled={isAnswered}
                         className={btnClass}
                       >
                         <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {option}
                       </button>
                     );
                   })}
                </div>

                {isAnswered && (
                  <div className="px-6 pb-6 animate-fade-in">
                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-4">
                      <h4 className="font-bold text-blue-800 mb-1">Explanation:</h4>
                      <p className="text-blue-700 text-sm">{questions[currentQuestionIndex].explanation}</p>
                    </div>
                    <button 
                      onClick={nextQuestion}
                      className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold flex justify-center items-center gap-2 transition-all"
                    >
                      {currentQuestionIndex === questions.length - 1 ? "View Results" : "Next Question"} <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Results Card
            <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-8 text-center animate-fade-in">
               <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                 <GraduationCap size={40} />
               </div>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
               
               <div className="mb-8">
                 <div className="text-6xl font-bold text-slate-800 mb-2">{Math.round((score / questions.length) * 100)}%</div>
                 <div className={`text-2xl font-bold ${getGradeInfo(score, questions.length).color}`}>
                   Grade {getGradeInfo(score, questions.length).grade}: {getGradeInfo(score, questions.length).label}
                 </div>
                 <p className="text-slate-500 mt-2">You scored {score} out of {questions.length}</p>
               </div>
               
               <div className="flex justify-center gap-4">
                 <button 
                  onClick={resetQuiz}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold flex items-center gap-2 transition-all"
                 >
                   <RotateCcw size={18} /> Take New Quiz
                 </button>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Career Coach Component ---
export const CareerCoach = () => {
  const [loading, setLoading] = useState(false);
  const [adviceResult, setAdviceResult] = useState('');
  const [activeTab, setActiveTab] = useState<'advice' | 'jobs'>('jobs');
  const [jobList, setJobList] = useState<JobPosting[]>([]);
  const [isJobLoading, setIsJobLoading] = useState(false);
  const [jobCategory, setJobCategory] = useState<'Govt' | 'Private' | 'Both'>('Both');
  
  const [formData, setFormData] = useState({ 
    role: '', 
    skills: '', 
    experience: 'Fresher' 
  });

  const handleAdviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdviceResult('');
    setActiveTab('advice');
    try {
      const data = await generateCareerAdvice(formData.role, formData.skills, formData.experience);
      setAdviceResult(data);
    } catch (err) {
      setAdviceResult("Error generating advice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadJobs = async () => {
    setIsJobLoading(true);
    const jobs = await fetchJobListings(jobCategory);
    setJobList(jobs);
    setIsJobLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'jobs' && jobList.length === 0) {
      loadJobs();
    }
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Briefcase className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Career & Job Finder</h2>
            <p className="text-pink-100">Find the latest Govt & Private jobs or get AI career guidance.</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-slate-200 mb-6">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'jobs'
              ? 'bg-pink-100 text-pink-700 shadow-sm'
              : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50'
          }`}
        >
          <Building2 size={18} /> Job Alerts Board
        </button>
        <button
          onClick={() => setActiveTab('advice')}
          className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'advice'
              ? 'bg-pink-100 text-pink-700 shadow-sm'
              : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50'
          }`}
        >
          <UserCheck size={18} /> Career Coach
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Bell size={20} className="text-pink-600"/> Latest Notifications
               </h3>
               <button 
                onClick={loadJobs} 
                disabled={isJobLoading}
                className="text-sm flex items-center gap-1 text-pink-600 hover:text-pink-800"
               >
                 <RefreshCw size={14} className={isJobLoading ? "animate-spin" : ""} /> Refresh
               </button>
             </div>
             
             {isJobLoading ? (
               <div className="flex justify-center py-10"><Loader2 className="animate-spin text-pink-500" size={32} /></div>
             ) : (
               <div className="space-y-4">
                 {jobList.length === 0 && !isJobLoading && (
                   <div className="text-center py-10 text-slate-500">
                     No jobs found or connection error. Try refreshing.
                   </div>
                 )}
                 {jobList.map((job, idx) => (
                   <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                     <div className="flex-grow">
                       <div className="flex items-center gap-2 mb-1">
                         <span className={`text-xs font-bold px-2 py-0.5 rounded ${job.type === 'Govt' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                           {job.type}
                         </span>
                         <span className="text-xs text-slate-500">{job.posted}</span>
                       </div>
                       <h4 className="font-bold text-slate-900 text-lg">{job.title}</h4>
                       <p className="text-slate-600 text-sm font-medium">{job.company}</p>
                       <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-slate-500">
                         <span className="flex items-center gap-1"><Map size={14}/> {job.location}</span>
                         <span className="flex items-center gap-1"><Landmark size={14}/> {job.salary}</span>
                       </div>
                       {job.tags && job.tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {job.tags.map(tag => (
                              <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{tag}</span>
                            ))}
                          </div>
                       )}
                     </div>
                     <a 
                       href={job.applyLink || '#'} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center gap-2 shrink-0"
                     >
                       Apply <ExternalLink size={14} />
                     </a>
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">Filter Jobs</h3>
              <div className="space-y-2">
                {['Both', 'Govt', 'Private'].map((cat) => (
                   <label key={cat} className="flex items-center gap-2 cursor-pointer">
                     <input 
                      type="radio" 
                      name="category" 
                      className="text-pink-600 focus:ring-pink-500"
                      checked={jobCategory === cat}
                      onChange={() => setJobCategory(cat as any)}
                     />
                     <span className="text-sm text-slate-700">{cat} Jobs</span>
                   </label>
                ))}
              </div>
              <button onClick={loadJobs} className="mt-4 w-full bg-pink-100 text-pink-700 font-medium py-2 rounded-lg hover:bg-pink-200 text-sm">
                Apply Filters
              </button>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-xl text-white shadow-md">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Bell size={18}/> Get Daily Alerts</h3>
              <p className="text-xs text-slate-300 mb-4">Never miss a Govt or Private job update. Delivered to your inbox.</p>
              <input type="email" placeholder="Enter your email" className="w-full p-2 rounded text-sm text-slate-900 outline-none mb-2" />
              <button className="w-full bg-pink-600 hover:bg-pink-500 py-2 rounded font-medium text-sm">Subscribe</button>
            </div>
          </div>
        </div>
      ) : (
        <form className="bg-white p-6 rounded-xl shadow-md border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 text-sm font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2 mb-2">
            Your Profile
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Target Job Role <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none"
              placeholder="e.g. React Developer"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Experience Level</label>
            <select 
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none bg-white"
              value={formData.experience}
              onChange={e => setFormData({...formData, experience: e.target.value})}
            >
              <option>Student / Fresher</option>
              <option>1-3 Years</option>
              <option>3-5 Years</option>
              <option>5+ Years</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Key Skills <span className="text-red-500">*</span></label>
            <textarea 
              required
              rows={2}
              className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 outline-none resize-none"
              placeholder="e.g. JavaScript, Python, Communication, Excel"
              value={formData.skills}
              onChange={e => setFormData({...formData, skills: e.target.value})}
            />
          </div>

          <div className="md:col-span-2 mt-4">
            <button 
              type="button" 
              onClick={handleAdviceSubmit}
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-lg transition-all flex justify-center items-center gap-2 disabled:opacity-70 shadow-md hover:shadow-lg"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Briefcase size={20} />}
              {loading ? 'Thinking...' : 'Get AI Career Advice'}
            </button>
          </div>
        </form>
      )}

      {activeTab === 'advice' && adviceResult && (
        <ResponseDisplay content={adviceResult} />
      )}
    </div>
  );
};
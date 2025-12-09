import React, { useState, useEffect, useRef } from 'react';
import { 
  CalendarCheck, UserCheck, AlertCircle, Plus, Trash2, 
  Check, Calculator, Loader2, Timer, Play, Pause, RotateCcw, 
  Maximize, Minimize
} from 'lucide-react';
// Storage service no longer needed for current features
// import { storageService } from '../services/storage';

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

// --- Pomodoro Timer ---
export const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');

  // Enforce Fullscreen and Focus
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        resetTimer("Focus lost! Tab switched. Timer reset.");
      }
    };

    // If user exits fullscreen manually (ESC), reset timer
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && isActive) {
        resetTimer("Focus mode exited. Timer reset.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [isActive]);

  useEffect(() => {
    let interval: any = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(interval);
            resetTimer(); // Timer finished normally
            if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
            // Play notification sound here if desired
            alert("Timer Finished!");
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const switchMode = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setIsActive(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    setSeconds(0);
    if (newMode === 'focus') setMinutes(25);
    else if (newMode === 'short') setMinutes(5);
    else setMinutes(15);
  };

  const toggleTimer = async () => {
    if (!isActive) {
      // Start Timer - Request Fullscreen
      try {
        await document.documentElement.requestFullscreen();
        setIsActive(true);
      } catch (err) {
        console.error("Fullscreen denied:", err);
        // We still start the timer, but maybe warn user?
        setIsActive(true);
      }
    } else {
      // Pause Timer
      setIsActive(false);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const resetTimer = (message?: string) => {
    setIsActive(false);
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    
    setSeconds(0);
    if (mode === 'focus') setMinutes(25);
    else if (mode === 'short') setMinutes(5);
    else setMinutes(15);

    if (message) {
      alert(message);
    }
  };

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <div className={`bg-gradient-to-r ${mode === 'focus' ? 'from-rose-500 to-pink-600' : 'from-teal-500 to-emerald-600'} rounded-2xl p-8 text-white mb-8 shadow-lg transition-colors duration-500`}>
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
            <Timer className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Focus Timer</h2>
            <p className="text-white/90">
              {isActive ? "Strict Mode Active: Do not switch tabs." : "Stay productive with the Pomodoro technique."}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 flex flex-col items-center">
        {/* Mode Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl mb-8">
          <button 
            onClick={() => switchMode('focus')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'focus' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-rose-500'}`}
          >
            Focus
          </button>
          <button 
            onClick={() => switchMode('short')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'short' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-500 hover:text-teal-500'}`}
          >
            Short Break
          </button>
          <button 
            onClick={() => switchMode('long')}
            className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${mode === 'long' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-blue-500'}`}
          >
            Long Break
          </button>
        </div>

        {/* Timer Display */}
        <div className="relative mb-8">
          {/* Circular Progress (Visual only) */}
          <div className="w-64 h-64 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
             <div 
               className={`absolute inset-0 rounded-full border-8 ${mode === 'focus' ? 'border-rose-500' : 'border-teal-500'} opacity-20`}
             ></div>
             <div className="text-7xl font-bold text-slate-800 font-mono tracking-wider">
               {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
             </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-4">
          <button 
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transform active:scale-95 transition-all ${isActive ? 'bg-amber-500 hover:bg-amber-600' : (mode === 'focus' ? 'bg-rose-500 hover:bg-rose-600' : 'bg-teal-500 hover:bg-teal-600')}`}
          >
            {isActive ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
          </button>
          <button 
            onClick={() => resetTimer()}
            className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <RotateCcw size={24} />
          </button>
        </div>
        <p className="mt-6 text-xs text-slate-400 text-center max-w-xs">
          Starting the timer will enable Fullscreen. Switching tabs or exiting fullscreen will reset the timer to ensure focus.
        </p>
      </div>
    </div>
  );
};
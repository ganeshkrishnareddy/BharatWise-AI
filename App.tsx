import React, { useState } from 'react';
import { AppView } from './types';
import { AttendanceTool, CgpaCalculator, PomodoroTimer } from './components/FeatureComponents';
import { 
  Menu, 
  X, 
  Layout, 
  CalendarCheck,
  Calculator,
  Timer
} from 'lucide-react';

const App = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: AppView.HOME, label: 'Home', icon: <Layout size={20} /> },
    { id: AppView.POMODORO, label: 'Focus Timer', icon: <Timer size={20} /> },
    { id: AppView.ATTENDANCE, label: 'Attendance', icon: <CalendarCheck size={20} /> },
    { id: AppView.CGPA, label: 'CGPA Calc', icon: <Calculator size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setActiveView(AppView.HOME)}
            >
              <div className="bg-primary text-white p-1.5 rounded-lg">
                <Layout size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                BharatWise
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === item.id
                      ? 'text-primary bg-indigo-50'
                      : 'text-slate-600 hover:text-primary hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-slate-500 hover:text-slate-700 p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 bg-white shadow-lg absolute w-full z-40">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-3 py-3 text-base font-medium rounded-md ${
                    activeView === item.id
                      ? 'text-primary bg-indigo-50'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {activeView === AppView.HOME && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-primary text-sm font-medium">
                <Layout size={16} />
                <span>Student Utility Dashboard</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                Welcome to <span className="text-primary">BharatWise</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                Essential tools for student success. 
                Track attendance and maintain focus on your studies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button 
                  onClick={() => setActiveView(AppView.POMODORO)}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
                >
                  Start Focus Timer
                </button>
                <button 
                  onClick={() => setActiveView(AppView.ATTENDANCE)}
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Check Attendance
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div 
                onClick={() => setActiveView(AppView.POMODORO)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-rose-100 rounded-lg flex items-center justify-center text-rose-600 mb-4 group-hover:scale-110 transition">
                  <Timer size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Focus Timer</h3>
                <p className="text-slate-600">Boost productivity with the strict Pomodoro technique.</p>
              </div>

              <div 
                onClick={() => setActiveView(AppView.ATTENDANCE)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-4 group-hover:scale-110 transition">
                  <CalendarCheck size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Attendance Calc</h3>
                <p className="text-slate-600">Calculate safe bunks and attendance requirements.</p>
              </div>

              <div 
                onClick={() => setActiveView(AppView.CGPA)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition">
                  <Calculator size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">CGPA Predictor</h3>
                <p className="text-slate-600">Track your grades and forecast your results.</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Views */}
        {activeView === AppView.ATTENDANCE && <AttendanceTool />}
        {activeView === AppView.CGPA && <CgpaCalculator />}
        {activeView === AppView.POMODORO && <PomodoroTimer />}
        
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:text-left">
          <div className="mb-4 sm:mb-0">
            <h4 className="text-white font-bold text-lg mb-1">BharatWise</h4>
            <p className="text-sm">Empowering Student Productivity.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-right">
            <span>
              Developed And Maintained by{' '}
              <a href="https://progvision.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-indigo-400 transition-colors font-semibold">
                ProgVision
              </a>
            </span>
            <span>&copy; {new Date().getFullYear()} BharatWise</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
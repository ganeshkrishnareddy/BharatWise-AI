import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { AppView, ChatMessage } from './types';
import { generateChatResponse } from './services/geminiService';
import { StudyHub, CareerCoach, ExamPrep, CgpaCalculator, AiToolsDashboard } from './components/FeatureComponents';
import { 
  BookOpen, 
  Briefcase, 
  GraduationCap, 
  MessageCircle, 
  Menu, 
  X, 
  Sparkles, 
  Send,
  User,
  Bot,
  Calculator,
  LayoutGrid
} from 'lucide-react';

const App = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.HOME);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Namaste! I am BharatWise AI. How can I help you with your studies or career today?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeView === AppView.CHAT_BOT) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, activeView]);

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const responseText = await generateChatResponse(chatMessages, userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const navItems = [
    { id: AppView.HOME, label: 'Home', icon: <Sparkles size={20} /> },
    { id: AppView.STUDY_HUB, label: 'Study Hub', icon: <BookOpen size={20} /> },
    { id: AppView.CAREER_COACH, label: 'Career', icon: <Briefcase size={20} /> },
    { id: AppView.EXAM_PREP, label: 'Exams', icon: <GraduationCap size={20} /> },
    { id: AppView.AI_TOOLS, label: 'AI Tools', icon: <LayoutGrid size={20} /> },
    { id: AppView.CHAT_BOT, label: 'AI Tutor', icon: <MessageCircle size={20} /> },
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
                <Sparkles size={20} />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                BharatWise AI
              </span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
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
                <Sparkles size={16} />
                <span>Powered by Gemini 2.5 Flash</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight">
                Welcome to <span className="text-primary">BharatWise AI</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
                The all-in-one AI platform for students and job seekers. 
                Get study notes, clear doubts, track attendance, and plan your career instantly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <button 
                  onClick={() => setActiveView(AppView.STUDY_HUB)}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all transform hover:-translate-y-1"
                >
                  Start Studying
                </button>
                <button 
                  onClick={() => setActiveView(AppView.AI_TOOLS)}
                  className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-all"
                >
                  Explore Tools
                </button>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div 
                onClick={() => setActiveView(AppView.STUDY_HUB)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">NoteGenie</h3>
                <p className="text-slate-600">Instantly generate structured notes for CBSE, ICSE, or University topics.</p>
              </div>

              <div 
                onClick={() => setActiveView(AppView.EXAM_PREP)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4 group-hover:scale-110 transition">
                  <GraduationCap size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">ExamReady</h3>
                <p className="text-slate-600">Mock tests and practice questions for JEE, NEET, SSC, and Banking exams.</p>
              </div>

              <div 
                onClick={() => setActiveView(AppView.CAREER_COACH)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 mb-4 group-hover:scale-110 transition">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">CareerPath</h3>
                <p className="text-slate-600">Job Finder, Daily Alerts, and AI Career Advice.</p>
              </div>

              <div 
                onClick={() => setActiveView(AppView.AI_TOOLS)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition cursor-pointer group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-4 group-hover:scale-110 transition">
                  <LayoutGrid size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">AI Tools</h3>
                <p className="text-slate-600">Roadmaps, Essays, Attendance Calc, Code Debugging, and more.</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Views */}
        {activeView === AppView.STUDY_HUB && <StudyHub />}
        {activeView === AppView.CAREER_COACH && <CareerCoach />}
        {activeView === AppView.EXAM_PREP && <ExamPrep />}
        {activeView === AppView.AI_TOOLS && <AiToolsDashboard />}

        {/* Chat Bot Interface */}
        {activeView === AppView.CHAT_BOT && (
          <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">BharatWise AI Tutor</h3>
                <p className="text-xs text-slate-500">Always here to help.</p>
              </div>
            </div>
            
            <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      msg.role === 'user' ? 'bg-slate-200 text-slate-600' : 'bg-primary text-white'
                    }`}>
                      {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                    </div>
                    <div className={`p-4 rounded-2xl shadow-sm ${
                      msg.role === 'user' 
                        ? 'bg-white text-slate-800 border border-slate-100 rounded-tr-none' 
                        : 'bg-primary/5 text-slate-800 border border-primary/10 rounded-tl-none'
                    } ${msg.isError ? 'bg-red-50 text-red-600 border-red-100' : ''}`}>
                      <ReactMarkdown className="prose prose-sm max-w-none prose-p:text-inherit prose-headings:text-inherit prose-strong:text-inherit">
                        {msg.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              {isChatLoading && (
                 <div className="flex justify-start">
                   <div className="flex gap-3 max-w-[80%]">
                     <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                       <Sparkles size={16} />
                     </div>
                     <div className="bg-primary/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                       <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                       <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                       <div className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                   </div>
                 </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask a doubt, request a summary, or ask for advice..."
                  className="flex-grow p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  disabled={isChatLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-primary hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:text-left">
          <div className="mb-4 sm:mb-0">
            <h4 className="text-white font-bold text-lg mb-1">BharatWise AI</h4>
            <p className="text-sm">Empowering the Future.</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-right">
            <span>Powered by Gemini 2.5 Flash</span>
            <span>
              Developed And Maintained by{' '}
              <a href="https://progvision.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-indigo-400 transition-colors font-semibold">
                ProgVision
              </a>
            </span>
            <span>&copy; {new Date().getFullYear()} BharatWise AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
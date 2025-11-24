import React, { useState, useEffect, useRef } from 'react';
import BootScreen from './components/BootScreen';
import DesktopIcon from './components/DesktopIcon';
import Window from './components/Window';
import Terminal from './apps/Terminal';
import Profile from './apps/Profile';
import Projects from './apps/Projects';
import RetroArcade from './apps/RetroArcade';
import Notepad from './apps/Notepad';
import Calculator from './apps/Calculator';
import CalendarApp from './apps/CalendarApp';
import StartMenu from './components/StartMenu';
import AnalogClock from './components/AnalogClock';
import VideoPlayer from './components/VideoPlayer';
import { WindowState } from './types';
import { Terminal as TerminalIcon, User, FolderGit2, Power, Wifi, Volume2, Battery, Disc, Gamepad2, FileText, Calculator as CalcIcon, Calendar as CalIcon, Github } from 'lucide-react';

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(10);
  const [isStartOpen, setIsStartOpen] = useState(false);

  // Click outside to close start menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isStartOpen && !target.closest('.start-menu-container') && !target.closest('.start-button')) {
        setIsStartOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, [isStartOpen]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial Auto-Launch
  useEffect(() => {
    if (!isBooting) {
      setTimeout(() => openWindow('terminal', 'Terminal', <Terminal />, <TerminalIcon size={16} />), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBooting]);

  const openWindow = (id: string, title: string, component: React.ReactNode, icon: React.ReactNode) => {
    const existing = windows.find(w => w.id === id);
    if (existing) {
      setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w));
      setActiveId(id);
      setNextZIndex(prev => prev + 1);
      return;
    }

    const newWindow: WindowState = {
      id,
      title,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      component,
      icon,
      zIndex: nextZIndex
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveId(id);
    setNextZIndex(prev => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const focusWindow = (id: string) => {
    if (activeId === id) return;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZIndex } : w));
    setActiveId(id);
    setNextZIndex(prev => prev + 1);
  };

  const toggleMinimize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w));
  };

  const toggleMaximize = (id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  };

  // App Launcher Logic
  const launchApp = (appId: string) => {
    switch (appId) {
      case 'terminal': openWindow('terminal', 'Terminal', <Terminal />, <TerminalIcon size={16} />); break;
      case 'profile': openWindow('profile', 'Shubh Profile', <Profile />, <User size={16} />); break;
      case 'projects': openWindow('projects', 'Projects Explorer', <Projects />, <FolderGit2 size={16} />); break;
      case 'arcade': openWindow('arcade', 'Retro Arcade', <RetroArcade />, <Gamepad2 size={16} />); break;
      case 'notepad': openWindow('notepad', 'Notepad', <Notepad />, <FileText size={16} />); break;
      case 'calculator': openWindow('calculator', 'Calculator', <Calculator />, <CalcIcon size={16} />); break;
      case 'calendar': openWindow('calendar', 'Calendar', <CalendarApp />, <CalIcon size={16} />); break;
    }
  };

  if (isBooting) {
    return <BootScreen onComplete={() => setIsBooting(false)} />;
  }

  return (
    <div className="fixed inset-0 h-[100dvh] w-[100dvw] overflow-hidden bg-[#0d1117] text-white selection:bg-[#1793d1] selection:text-white">
      {/* Arch Linux Themed Background */}
      <div className="fixed inset-0 z-0 bg-[#0a0a0a]">
        {/* Main Gradient Texture */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{
            backgroundImage: "url('/img/wall.jpg')", // Dark abstract geometric
            filter: 'grayscale(0.2) contrast(1.1) brightness(0.7)'
          }}
        ></div>

        {/* Arch Blue Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1793d1]/10 via-transparent to-transparent"></div>

        {/* Stylized Logo Watermark */}
        <svg
          className="absolute bottom-[-5%] right-[5%] w-[40vh] h-[40vh] text-[#1793d1] opacity-[0.08] pointer-events-none rotate-6"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L2 22h20L12 2zm0 3.5L18.5 20h-13L12 5.5z" />
        </svg>
      </div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0"></div>

      {/* Widgets */}
      <AnalogClock />
      {/* Widgets */}
      <AnalogClock />
      <AnalogClock />
      <VideoPlayer isVisible={!windows.find(w => w.id === 'arcade')} />

      {/* Desktop Icons Area */}
      <div className="absolute top-4 left-4 flex flex-col gap-4 z-0">
        <DesktopIcon
          label="Terminal"
          icon={<TerminalIcon size={40} />}
          onClick={() => launchApp('terminal')}
        />
        <DesktopIcon
          label="Profile"
          icon={<User size={40} />}
          onClick={() => launchApp('profile')}
        />
        <DesktopIcon
          label="Projects"
          icon={<FolderGit2 size={40} />}
          onClick={() => launchApp('projects')}
        />
        <DesktopIcon
          label="Arcade"
          icon={<Gamepad2 size={40} className="text-[#1793d1]" />}
          onClick={() => launchApp('arcade')}
        />
        <DesktopIcon
          label="GitHub"
          icon={<Github size={40} />}
          onClick={() => window.open('https://github.com/shubhyagami', '_blank')}
        />
      </div>

      {/* Windows Layer */}
      {windows.map(w => (
        <Window
          key={w.id}
          windowState={w}
          onClose={() => closeWindow(w.id)}
          onMinimize={() => toggleMinimize(w.id)}
          onMaximize={() => toggleMaximize(w.id)}
          onFocus={() => focusWindow(w.id)}
        />
      ))}

      {/* Start Menu Container */}
      <div className="start-menu-container">
        <StartMenu isOpen={isStartOpen} onClose={() => setIsStartOpen(false)} onOpenApp={launchApp} />
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-[#0f0f0f]/90 backdrop-blur-md border-t border-[#1793d1]/30 flex items-center px-4 justify-between z-[9999]">

        {/* Start / App Menu */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsStartOpen(!isStartOpen)}
            className={`start-button p-1.5 rounded-sm transition-all ${isStartOpen ? 'bg-[#1793d1] shadow-[0_0_10px_#1793d1]' : 'bg-[#1793d1]/80 hover:bg-[#1793d1]'}`}
          >
            <Disc size={20} className={`text-white ${isStartOpen ? 'animate-spin' : ''}`} />
          </button>

          {/* Active Windows List */}
          <div className="flex gap-1 ml-4 overflow-x-auto no-scrollbar">
            {windows.map(w => (
              <button
                key={w.id}
                onClick={() => {
                  if (w.isMinimized) toggleMinimize(w.id);
                  focusWindow(w.id);
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-sm text-sm transition-all border-b-2 
                  ${activeId === w.id && !w.isMinimized
                    ? 'bg-white/10 border-[#1793d1] text-white'
                    : 'hover:bg-white/5 border-transparent text-gray-400'
                  }`}
              >
                {w.icon}
                <span className="max-w-[100px] truncate hidden md:inline">{w.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
          <div className="hidden md:flex gap-3 text-[#1793d1]">
            <Wifi size={14} />
            <Volume2 size={14} />
            <Battery size={14} />
          </div>
          <div className="h-4 w-[1px] bg-gray-600 mx-2"></div>
          <div className="flex flex-col items-end leading-tight">
            <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] text-gray-500">{currentTime.toLocaleDateString()}</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 hover:bg-red-500/20 p-2 rounded text-red-400"
          >
            <Power size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
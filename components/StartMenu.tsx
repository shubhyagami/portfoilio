import React from 'react';
import { Terminal, User, FolderGit2, Gamepad2, FileText, Calculator, Calendar as CalendarIcon, Power, Search } from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: string) => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose, onOpenApp }) => {
  if (!isOpen) return null;

  const apps = [
    { id: 'terminal', label: 'Terminal', icon: <Terminal size={20} />, color: 'text-green-400' },
    { id: 'profile', label: 'My Profile', icon: <User size={20} />, color: 'text-blue-400' },
    { id: 'projects', label: 'Projects', icon: <FolderGit2 size={20} />, color: 'text-yellow-400' },
    { id: 'arcade', label: 'Retro Arcade', icon: <Gamepad2 size={20} />, color: 'text-purple-400' },
    { id: 'notepad', label: 'Notepad', icon: <FileText size={20} />, color: 'text-gray-200' },
    { id: 'calculator', label: 'Calculator', icon: <Calculator size={20} />, color: 'text-orange-400' },
    { id: 'calendar', label: 'Calendar', icon: <CalendarIcon size={20} />, color: 'text-red-400' },
  ];

  return (
    <div className="absolute bottom-14 left-2 w-80 bg-[#1a1a1a]/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 fade-in duration-200">
      {/* User Header */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-purple-900 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-green-400 p-[2px]">
            <img
              src="\img\profil.jpeg"
              className="w-full h-full rounded-full object-cover grayscale hover:grayscale-0 transition-all"
              alt="User"
            />
          </div>
          <div>
            <div className="text-white font-bold">Shubh Kumar</div>
            <div className="text-blue-200 text-xs">Administrator</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-2 border-b border-gray-700">
        <div className="flex items-center gap-2 bg-black/40 rounded px-2 py-1.5 border border-gray-700 focus-within:border-blue-500 transition-colors">
          <Search size={14} className="text-gray-400" />
          <input
            type="text"
            placeholder="Type to search..."
            className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-500"
            autoFocus
          />
        </div>
      </div>

      {/* App List */}
      <div className="flex-1 p-2 overflow-y-auto max-h-[300px]">
        <div className="text-xs font-bold text-gray-500 mb-2 px-2">APPLICATIONS</div>
        <div className="space-y-1">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => { onOpenApp(app.id); onClose(); }}
              className="w-full flex items-center gap-3 p-2 hover:bg-white/10 rounded transition-colors text-left group"
            >
              <div className={`${app.color} group-hover:scale-110 transition-transform`}>
                {app.icon}
              </div>
              <span className="text-gray-200 text-sm">{app.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 bg-black/40 border-t border-gray-700 flex justify-between items-center">
        <button className="text-xs text-gray-400 hover:text-white transition-colors">
          System Settings
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-white/5 transition-colors"
        >
          <Power size={14} />
          <span>Shut Down</span>
        </button>
      </div>
    </div>
  );
};

export default StartMenu;
import React from 'react';
import { X, Minus, Square } from 'lucide-react';
import { WindowState } from '../types';

interface WindowProps {
  windowState: WindowState;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
}

const Window: React.FC<WindowProps> = ({ windowState, onClose, onMinimize, onMaximize, onFocus }) => {
  if (!windowState.isOpen || windowState.isMinimized) return null;

  return (
    <div 
      className={`absolute flex flex-col bg-[#0d1117] border border-gray-700 rounded-lg shadow-2xl overflow-hidden transition-all duration-200
        ${windowState.isMaximized ? 'top-0 left-0 w-full h-[calc(100vh-48px)] rounded-none' : 'top-10 left-4 md:left-20 w-[90vw] md:w-[60vw] h-[70vh]'}
      `}
      style={{ zIndex: windowState.zIndex }}
      onMouseDown={onFocus}
    >
      {/* Title Bar */}
      <div className="bg-[#161b22] px-3 py-2 flex justify-between items-center border-b border-gray-800 select-none">
        <div className="flex items-center gap-2 text-gray-300 font-mono text-sm">
          {windowState.icon}
          <span>{windowState.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1 hover:bg-gray-700 rounded text-gray-400"><Minus size={14} /></button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="p-1 hover:bg-gray-700 rounded text-gray-400"><Square size={12} /></button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1 hover:bg-red-500/20 hover:text-red-400 rounded text-gray-400"><X size={14} /></button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-[#0d1117] relative">
        {windowState.component}
      </div>
    </div>
  );
};

export default Window;

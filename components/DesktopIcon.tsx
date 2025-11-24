import React from 'react';

interface DesktopIconProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ label, icon, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col items-center gap-2 p-4 w-24 hover:bg-white/10 rounded-lg transition-colors focus:outline-none focus:bg-white/20"
    >
      <div className="text-blue-400 group-hover:scale-110 transition-transform duration-200 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
        {icon}
      </div>
      <span className="text-white text-xs text-center font-medium drop-shadow-md bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
        {label}
      </span>
    </button>
  );
};

export default DesktopIcon;

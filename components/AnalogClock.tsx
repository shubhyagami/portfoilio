import React, { useEffect, useState } from 'react';

const AnalogClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate degrees
  const secondsDeg = time.getSeconds() * 6;
  const minutesDeg = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hoursDeg = (time.getHours() % 12) * 30 + time.getMinutes() * 0.5;

  return (
    <div className="fixed top-6 right-6 w-32 h-32 hidden md:flex items-center justify-center z-0 pointer-events-none select-none">
      {/* Clock Body */}
      <div className="relative w-full h-full rounded-full border-4 border-gray-700/60 bg-[#0a0a0a]/80 backdrop-blur-md shadow-2xl box-border">
        
        {/* Markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 left-1/2 w-1 h-full"
            style={{ transform: `translateX(-50%) rotate(${i * 30}deg)` }}
          >
            <div className="w-full h-2 bg-gray-500"></div>
          </div>
        ))}

        {/* Hour Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-1.5 h-8 bg-white rounded-full shadow-sm z-10"
          style={{ 
            transformOrigin: 'bottom',
            transform: `translate(-50%, -100%) rotate(${hoursDeg}deg)` 
          }}
        ></div>

        {/* Minute Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-1 h-12 bg-blue-400 rounded-full shadow-sm z-20"
          style={{ 
            transformOrigin: 'bottom',
            transform: `translate(-50%, -100%) rotate(${minutesDeg}deg)` 
          }}
        ></div>

        {/* Second Hand */}
        <div 
          className="absolute top-1/2 left-1/2 w-0.5 h-14 bg-red-500 z-30"
          style={{ 
            transformOrigin: 'bottom',
            transform: `translate(-50%, -100%) rotate(${secondsDeg}deg)` 
          }}
        ></div>
        
        {/* Center Dot - Placed last to be on top of hands */}
        <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-red-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-40 shadow-md ring-2 ring-black/50"></div>

        {/* Date Display */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/40 px-1.5 py-0.5 rounded border border-white/10 z-0">
            <div className="text-[9px] font-mono text-green-400 leading-none">
              {time.toLocaleDateString([], { day: '2-digit', month: 'short' }).toUpperCase()}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AnalogClock;
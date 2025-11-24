import React, { useEffect, useState, useRef } from 'react';
import { BOOT_LOGS } from '../constants';

interface BootScreenProps {
  onComplete: () => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < BOOT_LOGS.length) {
        setLogs(prev => [...prev, BOOT_LOGS[currentIndex]]);
        currentIndex++;
        
        // Auto scroll
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 150);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-black text-green-500 font-mono h-screen w-screen p-8 text-sm md:text-base overflow-hidden flex flex-col justify-end">
      <div className="mb-4 text-white font-bold text-xl animate-pulse">
        ShubhBIOS (C) 2025 American Megatrends, Inc.
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-1">
        {logs.map((log, index) => (
          <div key={index} className="break-all">
            <span className="text-gray-500 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {log}
          </div>
        ))}
        <div className="h-4 w-3 bg-green-500 animate-pulse inline-block mt-2"></div>
      </div>
    </div>
  );
};

export default BootScreen;

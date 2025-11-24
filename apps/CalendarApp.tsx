import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarApp: React.FC = () => {
  const today = new Date();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  const startDay = new Date(currentYear, today.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const empties = Array.from({ length: startDay }, (_, i) => i);

  return (
    <div className="h-full bg-white text-black flex flex-col">
      <div className="bg-red-500 p-4 text-white flex items-center justify-between">
        <h2 className="text-2xl font-bold">{currentMonth} {currentYear}</h2>
        <div className="flex gap-2">
            <button className="p-1 hover:bg-white/20 rounded"><ChevronLeft /></button>
            <button className="p-1 hover:bg-white/20 rounded"><ChevronRight /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 p-4 flex-1 bg-gray-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-center font-bold text-gray-400 text-xs uppercase">{d}</div>
        ))}
        {empties.map(e => <div key={`e-${e}`}></div>)}
        {days.map(d => (
            <div 
                key={d} 
                className={`
                    h-10 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer hover:bg-gray-200 transition-colors
                    ${d === today.getDate() ? 'bg-red-500 text-white hover:bg-red-600 shadow-md' : 'text-gray-700'}
                `}
            >
                {d}
            </div>
        ))}
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        Events: No events scheduled for today.
      </div>
    </div>
  );
};

export default CalendarApp;
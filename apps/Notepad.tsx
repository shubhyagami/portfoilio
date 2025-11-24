import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';

const Notepad: React.FC = () => {
  const [text, setText] = useState('');
  
  useEffect(() => {
    const saved = localStorage.getItem('shubh-notepad');
    if (saved) setText(saved);
    else setText("Welcome to ShubhOS Notepad.\n\nFeel free to type notes here. They will be saved automatically to your local browser storage.");
  }, []);

  const handleSave = () => {
    localStorage.setItem('shubh-notepad', text);
    alert('File Saved Successfully!');
  };

  return (
    <div className="h-full flex flex-col bg-[#1e1e1e] text-white">
      <div className="flex items-center gap-2 p-2 bg-[#2d2d2d] border-b border-gray-700">
        <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-sm">
            <Save size={14} /> Save
        </button>
        <button onClick={() => setText('')} className="flex items-center gap-1 px-3 py-1 hover:bg-white/10 rounded text-sm">
            <Trash2 size={14} /> Clear
        </button>
      </div>
      <textarea
        className="flex-1 bg-[#1e1e1e] text-gray-200 p-4 outline-none resize-none font-mono text-sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
      />
      <div className="p-1 bg-[#007acc] text-xs text-white flex justify-end px-4">
        Ln {text.split('\n').length}, Col {text.length}
      </div>
    </div>
  );
};

export default Notepad;
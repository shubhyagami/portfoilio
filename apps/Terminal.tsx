import React, { useState, useRef, useEffect } from 'react';
import { RESUME_DATA, PROJECTS, SKILLS } from '../constants';

const Terminal: React.FC = () => {
  const [history, setHistory] = useState<Array<{ cmd: string; output: React.ReactNode }>>([
    { cmd: 'neofetch', output: 'Loading system info...' }
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial Neofetch Load
    setTimeout(() => {
      setHistory([
        { 
          cmd: 'welcome', 
          output: (
            <div className="text-gray-300">
              Welcome to ShubhOS Terminal. Type <span className="text-yellow-400">'help'</span> to see available commands.
            </div>
          ) 
        },
        { cmd: 'neofetch', output: renderNeofetch() }
      ]);
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const renderNeofetch = () => (
    <div className="flex flex-col md:flex-row gap-4 text-sm font-mono mt-2 mb-4">
      <div className="hidden md:block text-blue-500 whitespace-pre leading-none select-none">
{`
       /\\
      /  \\
     /    \\      
    /      \\     
   /   /\\   \\    
  /   /  \\   \\   
 /   /    \\   \\  
/___/      \\___\\ 
`}
      </div>
      <div className="flex flex-col justify-center">
        <div><span className="text-green-400 font-bold">shubh</span>@<span className="text-blue-400">archlinux</span></div>
        <div className="border-b border-gray-600 w-full my-1"></div>
        <div><span className="text-yellow-400">OS</span>: ShubhOS (Arch Based)</div>
        <div><span className="text-yellow-400">Kernel</span>: 6.8.9-zen</div>
        <div><span className="text-yellow-400">Uptime</span>: 24 years, 5 days</div>
        <div><span className="text-yellow-400">Shell</span>: zsh 5.9</div>
        <div><span className="text-yellow-400">Resolution</span>: 3840x2160</div>
        <div><span className="text-yellow-400">CPU</span>: ECE Graduate (Human)</div>
        <div><span className="text-yellow-400">Memory</span>: Infinite Learning Capacity</div>
        <div className="flex gap-1 mt-2">
          <div className="w-3 h-3 bg-red-500"></div>
          <div className="w-3 h-3 bg-green-500"></div>
          <div className="w-3 h-3 bg-yellow-500"></div>
          <div className="w-3 h-3 bg-blue-500"></div>
          <div className="w-3 h-3 bg-purple-500"></div>
        </div>
      </div>
    </div>
  );

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    let output: React.ReactNode = '';

    switch (cmd) {
      case 'help':
        output = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-300">
            <div><span className="text-yellow-400">neofetch</span> - System Info</div>
            <div><span className="text-yellow-400">cat about</span> - View Summary</div>
            <div><span className="text-yellow-400">ls projects</span> - List Projects</div>
            <div><span className="text-yellow-400">cat skills</span> - View Skills</div>
            <div><span className="text-yellow-400">contact</span> - Contact Info</div>
            <div><span className="text-yellow-400">clear</span> - Clear Screen</div>
          </div>
        );
        break;
      case 'neofetch':
        output = renderNeofetch();
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'cat about':
        output = <div className="text-gray-300 max-w-2xl">{RESUME_DATA.summary}</div>;
        break;
      case 'ls':
      case 'ls projects':
        output = (
          <div className="space-y-1">
            {PROJECTS.map(p => (
              <div key={p.title} className="flex items-center gap-2">
                <span className="text-blue-400">drwxr-xr-x</span>
                <span className="text-green-400">{p.title.toLowerCase().replace(/\s+/g, '-')}</span>
                <span className="text-gray-500 text-xs">({p.type})</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'cat skills':
        output = (
          <div className="space-y-2">
            {SKILLS.map(s => (
              <div key={s.category}>
                <span className="text-purple-400 font-bold">{s.category}:</span>
                <span className="text-gray-300 ml-2">{s.items.join(', ')}</span>
              </div>
            ))}
          </div>
        );
        break;
      case 'contact':
        output = (
          <div>
             <div>Email: {RESUME_DATA.email}</div>
             <div>Phone: {RESUME_DATA.phone}</div>
             <div>LinkedIn: {RESUME_DATA.linkedin}</div>
          </div>
        );
        break;
      default:
        output = <div className="text-red-400">Command not found: {cmd}. Type 'help'.</div>;
    }

    setHistory(prev => [...prev, { cmd: input, output }]);
    setInput('');
  };

  return (
    <div 
      className="h-full bg-black/90 p-4 font-mono text-sm md:text-base text-gray-200 overflow-y-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {history.map((h, i) => (
        <div key={i} className="mb-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400">shubh@arch</span>
            <span className="text-pink-400">~</span>
            <span className="text-blue-400">$</span>
            <span>{h.cmd}</span>
          </div>
          <div className="mt-1 ml-2">{h.output}</div>
        </div>
      ))}
      <form onSubmit={handleCommand} className="flex items-center gap-2">
        <span className="text-green-400">shubh@arch</span>
        <span className="text-pink-400">~</span>
        <span className="text-blue-400">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="bg-transparent border-none outline-none flex-1 text-gray-100"
          autoFocus
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};

export default Terminal;

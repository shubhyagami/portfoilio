import React from 'react';
import { PROJECTS } from '../constants';
import { Folder, GitBranch, Cpu, Server, Bot, Cloud, Terminal } from 'lucide-react';

const Projects: React.FC = () => {
  const getIcon = (title: string) => {
    if (title.toLowerCase().includes('robot') || title.toLowerCase().includes('arm')) return <Bot size={40} />;
    if (title.toLowerCase().includes('cloud')) return <Cloud size={40} />;
    if (title.toLowerCase().includes('terminal')) return <Terminal size={40} />;
    return <Folder size={40} />;
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-[#0a0a0a] p-6 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {PROJECTS.map((project, index) => (
          <div 
            key={index}
            className="group relative bg-[#121212] border border-gray-800 hover:border-green-500/50 rounded-xl p-6 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,255,100,0.2)]"
          >
            {/* Tech Decoration */}
            <div className="absolute top-4 right-4 text-gray-700 group-hover:text-green-500 transition-colors">
               <GitBranch size={20} />
            </div>

            <div className="mb-4 text-gray-500 group-hover:text-green-400 transition-colors">
              {getIcon(project.title)}
            </div>

            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-green-400 transition-colors">{project.title}</h3>
            <p className="text-xs text-blue-400 font-mono mb-4">{project.type} | {project.date}</p>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              {project.description}
            </p>

            {/* Tech Stack Chips */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {project.tech.map(t => (
                <span key={t} className="text-xs font-mono bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700 group-hover:border-green-900/50 group-hover:bg-green-900/10 group-hover:text-green-200 transition-colors">
                  {t}
                </span>
              ))}
            </div>

            {/* 3D decorative bottom line */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}

        {/* Robotics Special Highlight Card */}
        <div className="relative bg-[#001000] border border-green-800 rounded-xl p-6 col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-green-400 mb-2 flex items-center gap-2">
                        <Cpu className="animate-spin-slow" /> 
                        Robotics Excellence
                    </h3>
                    <p className="text-gray-300 mb-4">
                        Specializing in hardware automation and AI-driven robotics. Notable achievements include the "Ethan" E-Waste robot and Pneumatic Robotic Arm systems, bridging the gap between software logic and physical actuation.
                    </p>
                    <div className="flex gap-4">
                        <div className="flex flex-col items-center p-3 bg-black/40 rounded border border-green-900">
                            <span className="text-2xl font-bold text-white">2+</span>
                            <span className="text-xs text-gray-500 uppercase">Prototypes</span>
                        </div>
                        <div className="flex flex-col items-center p-3 bg-black/40 rounded border border-green-900">
                            <span className="text-2xl font-bold text-white">IoT</span>
                            <span className="text-xs text-gray-500 uppercase">Integration</span>
                        </div>
                    </div>
                </div>
                {/* Visual Representation of Robot (CSS only) */}
                <div className="w-32 h-32 md:w-48 md:h-48 relative animate-pulse">
                     <div className="absolute inset-0 border-4 border-green-500/30 rounded-full border-t-green-500 animate-[spin_3s_linear_infinite]"></div>
                     <div className="absolute inset-4 border-2 border-green-500/20 rounded-full border-b-green-400 animate-[spin_5s_linear_infinite_reverse]"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Bot size={64} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

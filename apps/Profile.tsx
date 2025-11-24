import React from 'react';
import { RESUME_DATA, SKILLS } from '../constants';
import { MapPin, Mail, Phone, Linkedin, Download, ShieldCheck } from 'lucide-react';

const Profile: React.FC = () => {
  const downloadResume = () => {
    const link = document.createElement("a");
    link.href = "/doc/MyresumE.pdf";
    link.download = "Shubh-Kumar-Resume.pdf";
    link.click();
  };

  return (
    <div className="h-full bg-[#0f172a] text-white p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left Column: ID Card / Photo */}
        <div className="col-span-1">
          <div className="relative group perspective-1000">
            <div className="relative bg-black/40 border border-blue-500/50 p-1 rounded-xl overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(59,130,246,0.5)] transform transition-transform duration-500 hover:rotate-y-12">
              {/* Decorative Scanning Overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none z-20"></div>
              <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-400 shadow-[0_0_10px_#60a5fa] animate-[scan_2s_linear_infinite] z-20"></div>

              <div className="relative z-10 aspect-[3/4] overflow-hidden rounded-lg bg-gray-900">
                {/* Image Placeholder with filter for 'AI' look */}
                <img
                  src="/img/profil.jpeg"
                  alt="Shubh Kumar"
                  className="w-full h-full object-cover grayscale contrast-125 sepia-[.3] hue-rotate-[190deg] opacity-90 transition-all duration-500 group-hover:grayscale-0 group-hover:sepia-0 group-hover:hue-rotate-0"
                />
                {/* Badge Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md border border-white/10 p-2 rounded flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-mono text-blue-300">STATUS: ONLINE</span>
                </div>
              </div>
            </div>
            {/* Holographic Base */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-blue-500/20 blur-xl rounded-[100%]"></div>
          </div>

          <div className="mt-6 space-y-3 font-mono text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin size={16} />
              <span>{RESUME_DATA.location}</span>
            </div>
            <a href={`mailto:${RESUME_DATA.email}`} className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <Mail size={16} />
              <span className="truncate">{RESUME_DATA.email}</span>
            </a>
            <div className="flex items-center gap-2 text-gray-400">
              <Phone size={16} />
              <span>{RESUME_DATA.phone}</span>
            </div>
            <a href={RESUME_DATA.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors">
              <Linkedin size={16} />
              <span>LinkedIn Profile</span>
            </a>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400 glitch-text" data-text={RESUME_DATA.name}>
              {RESUME_DATA.name}
            </h1>
            <h2 className="text-xl text-blue-200 mt-2 font-mono flex items-center gap-2">
              <ShieldCheck size={20} className="text-green-500" />
              {RESUME_DATA.role}
            </h2>
            <div className="h-1 w-20 bg-blue-500 mt-4 rounded-full"></div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h3 className="text-lg font-bold text-gray-200 mb-2 border-b border-gray-700 pb-2">SYSTEM SUMMARY</h3>
            <p className="text-gray-300 leading-relaxed font-light">
              {RESUME_DATA.summary}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-200 mb-4 flex items-center gap-2">
              <span>INSTALLED MODULES (SKILLS)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SKILLS.map((skill) => (
                <div key={skill.category} className="bg-[#0b1221] border border-blue-900/30 p-4 rounded hover:border-blue-500/50 transition-colors">
                  <h4 className="text-blue-400 font-bold text-sm mb-2 uppercase tracking-wider">{skill.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {skill.items.map((item) => (
                      <span key={item} className="text-xs bg-blue-500/10 text-blue-200 px-2 py-1 rounded border border-blue-500/20">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>


          <button onClick={downloadResume} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20">
            <Download size={18} />
            Download Full Resume (PDF)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;

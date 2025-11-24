import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, HardDrive, ChevronLeft, Info, X, Upload, Play, AlertTriangle, Disc, FolderOpen, Volume2, VolumeX } from 'lucide-react';
import { VIRTUAL_FILESYSTEM } from '../constants';

// Declare jsnes type for the global window object
declare global {
    interface Window {
        jsnes: any;
    }
}

const RetroArcade: React.FC = () => {
    const [view, setView] = useState<'BROWSER' | 'EMULATOR'>('BROWSER');
    const [romName, setRomName] = useState<string | null>(null);
    const [showInfo, setShowInfo] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [localLibrary, setLocalLibrary] = useState<File[]>([]);

    // Emulator Refs
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nesRef = useRef<any>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const frameIdRef = useRef<number>(0);

    // --- Emulator Core Logic ---

    const initAudio = () => {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;

        if (!audioCtxRef.current) {
            audioCtxRef.current = new AudioContext();
        }

        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume().catch(err => console.error("Audio resume failed:", err));
        }

        const bufferSize = 4096;
        if (!scriptProcessorRef.current) {
            scriptProcessorRef.current = audioCtxRef.current.createScriptProcessor(bufferSize, 0, 2);
            scriptProcessorRef.current.onaudioprocess = (e) => {
                const left = e.outputBuffer.getChannelData(0);
                const right = e.outputBuffer.getChannelData(1);

                if (nesRef.current && !isMuted) {
                    // Generate audio samples from NES
                    nesRef.current.generateAudio(left, right, bufferSize);
                } else {
                    // Silence if muted or not running
                    left.fill(0);
                    right.fill(0);
                }
            };
            scriptProcessorRef.current.connect(audioCtxRef.current.destination);
        }
    };

    const stopAudio = () => {
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (audioCtxRef.current) {
            if (audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close().catch(console.error);
            }
            audioCtxRef.current = null;
        }
    };

    const keyboardController = (e: KeyboardEvent, isPressed: boolean) => {
        if (!nesRef.current) return;
        // Controller 1
        const controller = 1;

        switch (e.key) {
            case 'z': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_A); break; // A
            case 'x': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_B); break; // B
            case 'Shift': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_SELECT); break; // Select
            case 'Enter': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_START); break; // Start
            case 'ArrowUp': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_UP); break;
            case 'ArrowDown': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_DOWN); break;
            case 'ArrowLeft': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_LEFT); break;
            case 'ArrowRight': nesRef.current.buttonDown(controller, window.jsnes.Controller.BUTTON_RIGHT); break;
        }

        if (!isPressed) {
            switch (e.key) {
                case 'z': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_A); break;
                case 'x': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_B); break;
                case 'Shift': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_SELECT); break;
                case 'Enter': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_START); break;
                case 'ArrowUp': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_UP); break;
                case 'ArrowDown': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_DOWN); break;
                case 'ArrowLeft': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_LEFT); break;
                case 'ArrowRight': nesRef.current.buttonUp(controller, window.jsnes.Controller.BUTTON_RIGHT); break;
            }
        }
    };

    const startEmulator = (romData: string) => {
        if (!window.jsnes) {
            setError("Emulator library failed to load. Please check internet connection.");
            return;
        }

        try {
            // 1. Initialize Screen
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const imageData = ctx.createImageData(256, 240);

            // 2. Initialize NES
            nesRef.current = new window.jsnes.NES({
                onFrame: (buffer: number[]) => {
                    let i = 0;
                    for (let y = 0; y < 240; ++y) {
                        for (let x = 0; x < 256; ++x) {
                            i = y * 256 + x;
                            // Buffer is 32-bit integer, we need to unpack to RGBA
                            const pixel = buffer[i];
                            imageData.data[i * 4] = pixel & 0xFF; // R
                            imageData.data[i * 4 + 1] = (pixel >> 8) & 0xFF; // G
                            imageData.data[i * 4 + 2] = (pixel >> 16) & 0xFF; // B
                            imageData.data[i * 4 + 3] = 0xFF; // Alpha
                        }
                    }
                    ctx.putImageData(imageData, 0, 0);
                },
                onAudioSample: (left: number, right: number) => {
                    // Audio handled by script processor
                }
            });

            // 3. Load ROM
            nesRef.current.loadROM(romData);

            // 4. Start Loop
            initAudio();

            const loop = () => {
                nesRef.current.frame();
                frameIdRef.current = requestAnimationFrame(loop);
            };
            frameIdRef.current = requestAnimationFrame(loop);

            // 5. Input Listeners
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);

        } catch (e) {
            console.error(e);
            setError("Failed to load ROM. File might be corrupted or not a valid NES file.");
            stopEmulator();
        }
    };

    const stopEmulator = () => {
        if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
        stopAudio();
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        nesRef.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => keyboardController(e, true);
    const handleKeyUp = (e: KeyboardEvent) => keyboardController(e, false);

    // --- File Handling ---

    const handleUrlLoad = async (path: string, title: string) => {
        setError(null);
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`Failed to load file: ${response.statusText}`);
            }
            const arrayBuffer = await response.arrayBuffer();

            // Convert ArrayBuffer to binary string for JSNES
            let binary = '';
            const bytes = new Uint8Array(arrayBuffer);
            const len = bytes.byteLength;
            for (let i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }

            setView('EMULATOR');
            setRomName(title);
            setTimeout(() => startEmulator(binary), 100);

        } catch (err) {
            console.error(err);
            setError(`Could not fetch game from "${path}". Please ensure the file exists in your 'public/games' folder or upload it manually.`);
        }
    };

    const handleFileSelect = (file: File) => {
        if (!file) return;
        setError(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            const result = e.target?.result;
            if (result && typeof result === 'string') {
                setView('EMULATOR');
                setRomName(file.name);
                // Small delay to ensure DOM is ready
                setTimeout(() => startEmulator(result), 100);
            }
        };
        // JSNES expects binary string
        reader.readAsBinaryString(file);
    };

    const handleBatchUpload = (files: FileList) => {
        if (!files.length) return;
        const newFiles: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.name.toLowerCase().endsWith('.nes') || file.name.toLowerCase().endsWith('.bin')) {
                newFiles.push(file);
            }
        }
        setLocalLibrary(prev => [...prev, ...newFiles]);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const files = e.dataTransfer.files;
        if (files.length === 1) {
            // Single file drop = Play immediately
            handleFileSelect(files[0]);
        } else if (files.length > 1) {
            // Multiple file drop = Add to library
            handleBatchUpload(files);
        }
    };

    useEffect(() => {
        return () => stopEmulator(); // Cleanup on unmount
    }, []);

    const handleEject = () => {
        stopEmulator();
        setView('BROWSER');
        setRomName(null);
        setError(null);
    };

    return (
        <div className="h-full bg-[#111] flex flex-col font-mono select-none relative">
            {/* Controls Info Modal */}
            {showInfo && (
                <div className="absolute inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in" onClick={() => setShowInfo(false)}>
                    <div className="bg-[#202020] border border-red-900/50 p-8 rounded-xl max-w-md text-white shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowInfo(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black italic mb-6 text-red-500 flex items-center gap-3 border-b border-gray-800 pb-2">
                            <Gamepad2 size={28} />
                            CONTROLLER MAP
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-black/40 p-4 rounded border border-gray-700">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">D-Pad / Movement</div>
                                <div className="font-bold text-white flex items-center gap-2"><span className="text-red-500">●</span> Arrow Keys</div>
                            </div>
                            <div className="bg-black/40 p-4 rounded border border-gray-700">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Action Buttons</div>
                                <div className="font-bold text-white flex items-center gap-2"><span className="text-red-500">●</span> Z (A) / X (B)</div>
                            </div>
                            <div className="bg-black/40 p-4 rounded border border-gray-700">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">System</div>
                                <div className="font-bold text-white flex items-center gap-2"><span className="text-red-500">●</span> Enter (Start)</div>
                            </div>
                            <div className="bg-black/40 p-4 rounded border border-gray-700">
                                <div className="text-gray-500 text-[10px] uppercase tracking-wider mb-1">Options</div>
                                <div className="font-bold text-white flex items-center gap-2"><span className="text-red-500">●</span> Shift (Select)</div>
                            </div>
                        </div>
                        <p className="mt-6 text-xs text-gray-400 text-center border-t border-gray-800 pt-4">
                            Supports standard .nes ROM files. Drag & Drop enabled.
                        </p>
                    </div>
                </div>
            )}

            {/* Header Toolbar */}
            <div className="h-12 bg-[#1a1a1a] border-b border-black flex items-center px-4 justify-between shrink-0 z-10 shadow-md">
                <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center shadow-inner">
                        <Gamepad2 size={18} className="text-white" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="font-black tracking-wider italic text-white">NES<span className="text-red-500">EMU</span></span>
                        <span className="text-[10px] text-gray-500 font-mono">V.1.0.0</span>
                    </div>
                    {romName && (
                        <div className="ml-4 px-3 py-1 bg-blue-900/30 border border-blue-900 rounded text-blue-200 text-xs flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            {romName}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {/* Volume Toggle */}
                    <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors">
                        {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>

                    <button onClick={() => setShowInfo(true)} className="flex items-center gap-1 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 hover:text-white text-xs font-bold transition-colors" title="Controls">
                        <Info size={14} /> INFO
                    </button>
                    {view === 'EMULATOR' && (
                        <button onClick={handleEject} className="flex items-center gap-1 px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-bold transition-colors shadow-lg shadow-red-900/20">
                            <ChevronLeft size={14} /> EJECT CARTRIDGE
                        </button>
                    )}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 relative overflow-hidden bg-[#09090b]">

                {/* Browser / Drag & Drop Zone */}
                {view === 'BROWSER' && (
                    <div
                        className={`absolute inset-0 flex flex-col p-6 overflow-y-auto transition-colors duration-200 ${isDragOver ? 'bg-red-900/10' : ''}`}
                        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                        onDragLeave={() => setIsDragOver(false)}
                        onDrop={onDrop}
                    >
                        {/* Branding Header */}
                        <div className="flex flex-col items-center justify-center mb-10 animate-in fade-in zoom-in duration-500 mt-4">
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.4)] transform -rotate-6 border border-red-400/20">
                                    <Gamepad2 size={48} className="text-white drop-shadow-lg" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_2px_0_rgba(220,38,38,1)]">
                                        NES<span className="text-red-500">SYSTEM</span>
                                    </h1>
                                    <span className="text-xs font-mono text-gray-500 tracking-[0.4em] uppercase mt-1">Ready Player One</span>
                                </div>
                            </div>
                        </div>

                        {/* Add Local Folder */}
                        <div className="mb-8 max-w-3xl mx-auto w-full flex justify-end">
                            <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer border border-gray-700 text-xs font-bold text-gray-300 transition-colors">
                                <FolderOpen size={16} />
                                <span>ADD GAMES TO LIBRARY</span>
                                <input
                                    type="file"
                                    multiple
                                    accept=".nes,.bin"
                                    className="hidden"
                                    onChange={(e) => { if (e.target.files) handleBatchUpload(e.target.files); }}
                                />
                            </label>
                        </div>

                        {/* Library List */}
                        <div className="max-w-7xl mx-auto w-full space-y-6 pb-12">

                            {/* Local Library Section (Only shows if files added) */}
                            {localLibrary.length > 0 && (
                                <div className="animate-in slide-in-from-left-10 fade-in duration-500">
                                    <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-4 uppercase tracking-wider">
                                        <HardDrive size={14} />
                                        <span>Local Drive (Loaded Files)</span>
                                        <div className="flex-1 h-[1px] bg-blue-900/50"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {localLibrary.map((file, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-[#0f1219] border border-blue-900/30 rounded hover:border-blue-500/50 hover:bg-[#161b26] transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <Disc size={16} className="text-blue-500" />
                                                    <div className="text-sm text-gray-300 truncate max-w-[150px]">{file.name}</div>
                                                </div>
                                                <button
                                                    onClick={() => handleFileSelect(file)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded font-bold"
                                                >
                                                    PLAY
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Default System Cartridges */}
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-500 mb-4 uppercase tracking-wider">
                                    <HardDrive size={14} />
                                    <span>System Cartridges</span>
                                    <div className="flex-1 h-[1px] bg-gray-800"></div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {VIRTUAL_FILESYSTEM.games.map((game) => (
                                        <div key={game.id} className="group relative flex items-center justify-between p-4 bg-[#151515] border-l-4 border-y border-r border-gray-800 rounded-r hover:bg-[#1a1a1a] transition-all hover:translate-x-1 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]" style={{ borderLeftColor: game.color }}>
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-14 bg-gray-800 rounded-sm border border-gray-700 flex flex-col items-center justify-end pb-1 relative shadow-inner overflow-hidden">
                                                    <div className="absolute top-0 w-full h-2 bg-gray-900 border-b border-gray-950"></div>
                                                    <div className={`w-[80%] h-8 opacity-80 skew-y-6 scale-110 rounded-sm`} style={{ backgroundColor: game.color }}></div>
                                                </div>
                                                <div>
                                                    <div className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors font-mono truncate max-w-[120px]" title={game.title}>{game.title}</div>
                                                    <div className="text-[10px] text-gray-500 font-mono uppercase">{game.size}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleUrlLoad((game as any).path, game.title)}
                                                    className={`cursor-pointer flex items-center gap-2 px-4 py-2 text-white font-bold text-sm rounded-full border-2 transition-all transform active:scale-95 shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_currentColor]`}
                                                    style={{ backgroundColor: game.color, borderColor: game.color }}
                                                >
                                                    <Gamepad2 size={16} className="fill-current" />
                                                    <span>PLAY</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Emulator Canvas */}
                {view === 'EMULATOR' && (
                    <div className="w-full h-full flex items-center justify-center bg-black relative p-4">
                        {error ? (
                            <div className="text-center text-red-400 p-8 border border-red-900 bg-red-900/10 rounded max-w-md">
                                <AlertTriangle size={48} className="mx-auto mb-4 animate-pulse" />
                                <div className="font-bold mb-2">SYSTEM ERROR</div>
                                <div className="text-sm text-red-300">{error}</div>
                                <button onClick={handleEject} className="mt-6 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm">Return to Library</button>
                            </div>
                        ) : (
                            <div className="relative aspect-[4/3] h-full max-w-full bg-black shadow-2xl group">
                                <canvas
                                    ref={canvasRef}
                                    width={256}
                                    height={240}
                                    className="w-full h-full image-pixelated cursor-none"
                                    style={{ imageRendering: 'pixelated' }}
                                />
                                {/* CRT Effects */}
                                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-20 opacity-60"></div>
                                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-30"></div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RetroArcade;
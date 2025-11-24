import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, List, Maximize2, Minimize2 } from 'lucide-react';
import { Video } from '../types';
import { VIRTUAL_FILESYSTEM } from '../constants';

const VideoPlayer: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<HTMLDivElement>(null);

    const videos: Video[] = VIRTUAL_FILESYSTEM.videos || [];
    const currentVideo = videos[currentVideoIndex];

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying, currentVideoIndex]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
            setProgress(progress);
        }
    };

    const handleVideoEnd = () => {
        playNext();
    };

    const playNext = () => {
        setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
        setIsPlaying(true);
    };

    const playPrev = () => {
        setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
        setIsPlaying(true);
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = (parseFloat(e.target.value) / 100) * (videoRef.current?.duration || 0);
        if (videoRef.current) videoRef.current.currentTime = newTime;
        setProgress(parseFloat(e.target.value));
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
        setIsMuted(false);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            playerRef.current?.requestFullscreen();
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    if (!isVisible || videos.length === 0) return null;

    return (
        <div
            ref={playerRef}
            className={`fixed bottom-16 right-4 w-80 md:w-96 bg-[#0f172a] border border-blue-500/30 rounded-lg shadow-2xl overflow-hidden transition-all duration-300 z-50 ${isFullscreen ? 'w-full h-full bottom-0 right-0 rounded-none border-none' : ''}`}
        >
            {/* Video Display */}
            <div className="relative aspect-video bg-black group">
                <video
                    ref={videoRef}
                    src={currentVideo.path}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleVideoEnd}
                    onClick={togglePlay}
                />

                {/* Overlay Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-between text-white mb-2">
                        <span className="text-xs font-mono">{formatTime(videoRef.current?.currentTime || 0)}</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={handleSeek}
                            className="w-full mx-2 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-xs font-mono">{formatTime(videoRef.current?.duration || 0)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <button onClick={playPrev} className="hover:text-blue-400"><SkipBack size={18} /></button>
                            <button onClick={togglePlay} className="hover:text-blue-400">
                                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                            </button>
                            <button onClick={playNext} className="hover:text-blue-400"><SkipForward size={18} /></button>

                            <div className="flex items-center gap-1 group/vol">
                                <button onClick={toggleMute} className="hover:text-blue-400">
                                    {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="w-0 group-hover/vol:w-16 transition-all h-1 bg-gray-600 rounded-lg accent-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={() => setShowPlaylist(!showPlaylist)} className={`hover:text-blue-400 ${showPlaylist ? 'text-blue-400' : ''}`}>
                                <List size={18} />
                            </button>
                            <button onClick={toggleFullscreen} className="hover:text-blue-400">
                                {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Playlist & Info */}
            <div className={`bg-[#0f172a] transition-all duration-300 ${showPlaylist ? 'h-48' : 'h-12'}`}>
                <div className="p-3 border-b border-gray-800 flex justify-between items-center" onClick={() => setShowPlaylist(!showPlaylist)}>
                    <div className="truncate">
                        <h3 className="text-sm font-bold text-white truncate">{currentVideo.title}</h3>
                        <p className="text-xs text-gray-400 truncate">{currentVideo.duration}</p>
                    </div>
                </div>

                <div className="overflow-y-auto h-36 p-2 space-y-1">
                    {videos.map((video, idx) => (
                        <div
                            key={video.id}
                            onClick={() => {
                                setCurrentVideoIndex(idx);
                                setIsPlaying(true);
                            }}
                            className={`p-2 rounded cursor-pointer flex items-center gap-2 text-xs ${currentVideoIndex === idx ? 'bg-blue-600/20 text-blue-400' : 'hover:bg-white/5 text-gray-300'}`}
                        >
                            <div className="w-4">
                                {currentVideoIndex === idx && <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>}
                            </div>
                            <span className="truncate flex-1">{video.title}</span>
                            <span className="text-gray-500">{video.duration}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default VideoPlayer;

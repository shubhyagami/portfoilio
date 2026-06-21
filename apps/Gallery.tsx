import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, Play, Film } from 'lucide-react';

const imageModules = import.meta.glob<{ default: string }>('../image/*.{jpg,png,jpeg,webp,gif}', { eager: true });
const videoModules = import.meta.glob<{ default: string }>('../image/*.{mp4,webm,mov,avi}', { eager: true });

type MediaItem = {
  path: string;
  url: string;
  name: string;
  type: 'image' | 'video';
};

const images: MediaItem[] = Object.entries(imageModules)
  .map(([path, mod]) => ({
    path,
    url: mod.default,
    name: path.split('\\').pop()?.split('/').pop() || '',
    type: 'image' as const
  }));

const videos: MediaItem[] = Object.entries(videoModules)
  .map(([path, mod]) => ({
    path,
    url: mod.default,
    name: path.split('\\').pop()?.split('/').pop() || '',
    type: 'video' as const
  }));

const media: MediaItem[] = [...images, ...videos]
  .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

const MediaThumb: React.FC<{ item: MediaItem; onClick: () => void }> = ({ item, onClick }) => {
  if (item.type === 'image') {
    return (
      <img
        src={item.url}
        alt={item.name}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        loading="lazy"
      />
    );
  }
  return (
    <div className="w-full h-full relative bg-black">
      <video
        src={item.url}
        className="w-full h-full object-cover"
        muted
        preload="metadata"
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
        <div className="w-12 h-12 bg-green-500/80 rounded-full flex items-center justify-center">
          <Play size={24} className="text-white ml-0.5" fill="white" />
        </div>
      </div>
    </div>
  );
};

const LightboxMedia: React.FC<{ item: MediaItem }> = ({ item }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.removeAttribute('src');
      }
    };
  }, [item.url]);

  if (item.type === 'image') {
    return (
      <img
        src={item.url}
        alt={item.name}
        className="max-w-full max-h-[90vh] object-contain rounded-lg select-none"
      />
    );
  }

  return (
    <video
      ref={videoRef}
      src={item.url}
      className="max-w-full max-h-[90vh] rounded-lg"
      controls
      autoPlay
    />
  );
};

const Gallery: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % media.length);
    }
  };

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + media.length) % media.length);
    }
  };

  if (media.length === 0) {
    return (
      <div className="h-full bg-gradient-to-br from-gray-900 to-[#0a0a0a] p-6 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
          <p className="font-mono text-lg">No media found</p>
          <p className="text-sm mt-2">Add files to the <code className="bg-gray-800 px-2 py-0.5 rounded">image/</code> folder</p>
        </div>
      </div>
    );
  }

  const imgCount = images.length;
  const vidCount = videos.length;

  return (
    <div className="h-full bg-gradient-to-br from-gray-900 to-[#0a0a0a] p-6 overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white font-mono flex items-center gap-2">
          <ImageIcon size={20} className="text-green-400" />
          Gallery
          <span className="text-sm font-normal text-gray-500">
            ({imgCount} image{imgCount !== 1 ? 's' : ''}{vidCount > 0 ? `, ${vidCount} video${vidCount !== 1 ? 's' : ''}` : ''})
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pb-20">
        {media.map((item, index) => (
          <div
            key={item.path}
            className="group relative aspect-square bg-[#121212] border border-gray-800 hover:border-green-500/50 rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,255,100,0.2)]"
            onClick={() => openLightbox(index)}
          >
            <MediaThumb item={item} onClick={() => openLightbox(index)} />
            {item.type === 'video' && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-xs text-green-400 font-mono flex items-center gap-1">
                <Film size={12} />
                HD
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
              <span className="text-xs text-gray-300 truncate w-full font-mono">{item.name}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-red-500/20 hover:bg-red-500/40 p-2 rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>

          {media.length > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={goNext}
                className="absolute right-4 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              >
                <ChevronRight size={28} />
              </button>
            </>
          )}

          <div onClick={(e) => e.stopPropagation()}>
            <LightboxMedia item={media[selectedIndex]} />
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
            <span className="text-sm text-gray-300 font-mono">
              {selectedIndex + 1} / {media.length}
            </span>
            <span className="text-xs text-green-400 font-mono uppercase">
              {media[selectedIndex].type}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

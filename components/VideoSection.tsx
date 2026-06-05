'use client';

import { useState, useRef, useEffect } from 'react';

interface VideoSectionProps {
  basePath: string;
}

export default function VideoSection({ basePath }: VideoSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  // Preload video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
        {/* Placeholder overlay - hidden when video is playing */}
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent/10 transition-opacity duration-300 ${
            isPlaying ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-accent/20 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </div>
            <p className="text-gray-600 font-medium">{/*About Video Coming Soon*/}</p>
            <p className="text-sm text-gray-500">{/*Upload your video to replace this placeholder*/}</p>
          </div>
        </div>
        
        {/* Video element */}
        <video 
          ref={videoRef}
          className="w-full h-full object-cover" 
          controls 
          preload="metadata"
          poster={`${basePath}/images/video-thumbnail.jpg`}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        >
          <source src={`${basePath}/videos/about-video.mp4`} type="video/mp4" />
          <source src={`${basePath}/videos/about-video.webm`} type="video/webm" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

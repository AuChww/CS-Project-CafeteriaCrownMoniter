// YouTubeEmbed.tsx
import React from 'react';

interface YouTubeEmbedProps {
  src: string;
  title: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ src, title }) => {
  return (
    <div className="w-full h-auto">
      <iframe
        width="100%"
        height=""
        src={src}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title={title}
      />
    </div>
  );
};

export default YouTubeEmbed;

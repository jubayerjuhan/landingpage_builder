import React from 'react';
import { MediaPlayer, MediaProvider } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';

export interface VidstackPlayerProps {
  src: string | { src: string; type?: string };
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  /**
   * When true, disables pointer interactions on the underlying player. Useful while editing in the canvas.
   */
  disablePointerEvents?: boolean;
}

export const VidstackPlayer: React.FC<VidstackPlayerProps> = ({
  src,
  poster,
  title,
  autoPlay = false,
  controls = true,
  muted = false,
  loop = false,
  className,
  disablePointerEvents = false,
}) => {
  if (!src) {
    return null;
  }

  return (
    <div
      className={className}
      style={disablePointerEvents ? { pointerEvents: 'none' } : undefined}
    >
      <MediaPlayer
        src={src}
        poster={poster}
        title={title}
        controls={false}
        nativeControls={false}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        crossOrigin="anonymous"
      >
        <MediaProvider />
        {controls !== false && <DefaultVideoLayout icons={defaultLayoutIcons} />}
      </MediaPlayer>
    </div>
  );
};

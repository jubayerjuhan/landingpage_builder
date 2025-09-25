import React from 'react';
import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import type { VideoTextTrackConfig } from '../../../utils/video';

export interface VidstackPlayerProps {
  src: string | { src: string; type?: string };
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  controls?: boolean;
  muted?: boolean;
  loop?: boolean;
  className?: string;
  thumbnails?: string;
  textTracks?: VideoTextTrackConfig[];
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
  thumbnails,
  textTracks = [],
  disablePointerEvents = false,
}) => {
  if (!src) {
    return null;
  }

  const tracks = Array.isArray(textTracks) ? textTracks : [];

  return (
    <div
      className={className}
      style={disablePointerEvents ? { pointerEvents: 'none' } : undefined}
    >
      <MediaPlayer
        src={src}
        poster={poster}
        title={title}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        controls={false}
        nativeControls={false}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        crossOrigin="anonymous"
      >
        <MediaProvider>
          {poster && <Poster className="vidstack-poster" />}
          {tracks.map((track, index) =>
            track.src ? (
              <track
                key={`${track.src}-${index}`}
                src={track.src}
                kind={track.kind}
                label={track.label}
                srcLang={track.language}
                default={track.default}
                type={track.type}
              />
            ) : null
          )}
        </MediaProvider>
        {controls !== false && (
          <DefaultVideoLayout
            icons={defaultLayoutIcons}
            thumbnails={thumbnails}
          />
        )}
      </MediaPlayer>
    </div>
  );
};

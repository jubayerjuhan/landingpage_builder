import React, { useMemo } from 'react';
import { MediaPlayer, MediaProvider, Poster, Track, type PlayerSrc, type TrackProps } from '@vidstack/react';
import { DefaultVideoLayout, defaultLayoutIcons } from '@vidstack/react/player/layouts/default';
import '@vidstack/react/player/styles/base.css';
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import type { VideoTextTrackConfig } from '../../../utils/video';
import { DEFAULT_VIDEO_POSTER } from '../../../utils/video';

export interface VidstackPlayerProps {
  src: string | { src: string; type?: string } | Array<string | { src: string; type?: string }>;
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

const normalizeTrackType = (type?: string): TrackProps['type'] | undefined => {
  if (!type) return undefined;
  const normalized = type.trim().toLowerCase();

  switch (normalized) {
    case 'text/vtt':
    case 'vtt':
      return 'vtt';
    case 'application/x-subrip':
    case 'text/srt':
    case 'text/x-subrip':
    case 'srt':
      return 'srt';
    case 'ssa':
    case 'ass':
      return normalized as TrackProps['type'];
    case 'application/json':
    case 'json':
      return 'json';
    default:
      return normalized as TrackProps['type'];
  }
};

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
  const effectivePoster = poster ?? DEFAULT_VIDEO_POSTER;
  const playerSrc = useMemo<PlayerSrc | undefined>(() => {
    if (!src) return undefined;

    if (Array.isArray(src)) {
      const normalized = src
        .map((item) => {
          if (typeof item === 'string') {
            const trimmed = item.trim();
            return trimmed ? trimmed : null;
          }

          const trimmedSrc = item.src?.trim();
          return trimmedSrc ? { ...item, src: trimmedSrc } : null;
        })
        .filter((item): item is Exclude<PlayerSrc, string> | string => Boolean(item));

      return normalized.length > 0 ? (normalized as PlayerSrc) : undefined;
    }

    if (typeof src === 'string') {
      const trimmed = src.trim();
      return trimmed || undefined;
    }

    const trimmedSrc = src.src?.trim();
    return trimmedSrc ? { ...src, src: trimmedSrc } : undefined;
  }, [src]);

  const resolvedTracks = useMemo(
    () =>
      (Array.isArray(textTracks) ? textTracks : [])
        .filter((track) => Boolean(track?.src))
        .map((track) => ({
          ...track,
          type: normalizeTrackType(track.type),
        })),
    [textTracks]
  );

  if (!playerSrc) {
    return null;
  }

  return (
    <div
      className={className}
      style={disablePointerEvents ? { pointerEvents: 'none' } : undefined}
    >
      <MediaPlayer
        src={playerSrc}
        poster={effectivePoster}
        title={title}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        crossOrigin="anonymous"
      >
        <MediaProvider>
          {effectivePoster && <Poster className="vidstack-poster" />}
          {resolvedTracks.map((track, index) => (
            <Track
              key={`${track.src}-${index}`}
              src={track.src}
              kind={track.kind as TrackProps['kind']}
              label={track.label}
              lang={track.language}
              default={track.default}
              type={track.type}
            />
          ))}
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

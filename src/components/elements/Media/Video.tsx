import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import { MediaPlayer } from '@vidstack/react';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';

interface VideoProps {
  element: BuilderElement;
}

export const Video: React.FC<VideoProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);

  const videoStyles: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    borderRadius: '4px',
    boxSizing: 'border-box',
    ...styles,
  };

  const src = content.src || '';
  const autoplay =
    ((element.properties?.component as Record<string, unknown>)?.autoplay as boolean) || false;
  const controls = (element.properties?.component as Record<string, unknown>)?.controls !== false;
  const muted =
    ((element.properties?.component as Record<string, unknown>)?.muted as boolean) || false;
  const loop =
    ((element.properties?.component as Record<string, unknown>)?.loop as boolean) || false;

  // Check if it's a YouTube or Vimeo URL
  // Source can be regular MP4, HLS (.m3u8), YouTube, or Vimeo.

  // Vidstack Player (native controls if no custom layout)
  if (src) {
    return (
      <ElementWrapper element={element}>
        <div style={videoStyles}>
          <MediaPlayer
            playsInline
            autoPlay={autoplay}
            muted={muted}
            loop={loop}
            controls={controls}
            title="Video"
            src={src}
          >
            {/* Provider auto-selects based on src */}
          </MediaPlayer>
        </div>
      </ElementWrapper>
    );
  }

  // No source placeholder
  if (!src) {
    return (
      <ElementWrapper element={element}>
        <div
          style={{
            ...videoStyles,
            height: '200px',
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            border: '2px dashed #d1d5db',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📹</div>
            <div>Add video URL or file</div>
          </div>
        </div>
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper element={element}>
      <video
        src={src}
        style={videoStyles}
        controls={controls}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
      />
    </ElementWrapper>
  );
};

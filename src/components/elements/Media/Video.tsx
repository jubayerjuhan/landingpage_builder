import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface VideoProps {
  element: BuilderElement;
}

export const Video: React.FC<VideoProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const videoStyles: React.CSSProperties = {
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    borderRadius: '4px',
    ...styles,
  };
  
  const src = content.src || '';
  const autoplay = (element.properties?.component as any)?.autoplay || false;
  const controls = (element.properties?.component as any)?.controls !== false;
  const muted = (element.properties?.component as any)?.muted || false;
  const loop = (element.properties?.component as any)?.loop || false;
  
  // Check if it's a YouTube or Vimeo URL
  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const isVimeo = src.includes('vimeo.com');
  
  if (isYouTube || isVimeo) {
    let embedSrc = src;
    
    // Convert YouTube URLs to embed format
    if (isYouTube) {
      const videoId = src.includes('youtu.be/') 
        ? src.split('youtu.be/')[1]?.split('?')[0]
        : src.split('v=')[1]?.split('&')[0];
      
      if (videoId) {
        embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`;
      }
    }
    
    // Convert Vimeo URLs to embed format
    if (isVimeo) {
      const videoId = src.split('vimeo.com/')[1]?.split('/')[0];
      if (videoId) {
        embedSrc = `https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}`;
      }
    }
    
    return (
      <ElementWrapper element={element}>
        <div style={{ ...videoStyles, position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <iframe
            src={embedSrc}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '4px',
              border: 'none'
            }}
            allowFullScreen
            title="Video player"
          />
        </div>
      </ElementWrapper>
    );
  }
  
  // Regular video file
  if (!src) {
    return (
      <ElementWrapper element={element}>
        <div style={{
          ...videoStyles,
          height: '200px',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          border: '2px dashed #d1d5db'
        }}>
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
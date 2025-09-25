import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import { VidstackPlayer } from './VidstackPlayer';
import { getVideoConfigFromElement, hasVideoSource } from '../../../utils/video';

interface VideoProps {
  element: BuilderElement;
}

export const Video: React.FC<VideoProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getElementStyles(element, viewportMode);
  const videoStyles: React.CSSProperties = {
    width: '100%',
    maxWidth: '100%',
    borderRadius: '4px',
    overflow: 'hidden',
    ...styles,
  };

  const videoConfig = getVideoConfigFromElement(element);

  if (!hasVideoSource(videoConfig)) {
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
      <div style={videoStyles}>
        <VidstackPlayer
          src={videoConfig.source}
          poster={videoConfig.poster}
          title={videoConfig.title}
          controls={videoConfig.controls}
          autoPlay={videoConfig.autoplay}
          muted={videoConfig.muted}
          loop={videoConfig.loop}
        />
      </div>
    </ElementWrapper>
  );
};

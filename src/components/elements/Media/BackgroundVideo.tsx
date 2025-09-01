import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';

interface BackgroundVideoProps {
  element: BuilderElement;
  children?: React.ReactNode;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ element, children }) => {
  const { viewportMode } = useCanvasStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  
  const containerStyles: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    minHeight: '400px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...styles,
  };
  
  const videoStyles: React.CSSProperties = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    zIndex: -1,
    objectFit: 'cover',
  };
  
  const overlayStyles: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 0,
  };
  
  const contentStyles: React.CSSProperties = {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    color: 'white',
  };
  
  const src = content.src || '';
  const hasOverlay = (element.properties?.component as any)?.overlay !== false;
  
  return (
    <ElementWrapper element={element}>
      <div style={containerStyles}>
        {src ? (
          <video
            src={src}
            style={videoStyles}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
          />
        ) : (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280',
            fontSize: '1.5rem'
          }}>
            📹 Background Video
          </div>
        )}
        
        {hasOverlay && src && <div style={overlayStyles} />}
        
        <div style={contentStyles}>
          {children || (
            <div style={{
              padding: '2rem',
              maxWidth: '600px'
            }}>
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                margin: 0
              }}>
                Your Content Here
              </h2>
              <p style={{ 
                fontSize: '1.25rem', 
                opacity: 0.9,
                margin: '1rem 0 0 0'
              }}>
                Add text, buttons, or other content over your background video.
              </p>
            </div>
          )}
        </div>
      </div>
    </ElementWrapper>
  );
};
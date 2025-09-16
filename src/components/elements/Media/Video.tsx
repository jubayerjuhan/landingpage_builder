import React, { useRef, useState } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getCompleteElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import { MediaPlayer } from '@vidstack/react';
import 'vidstack/styles/defaults.css';
import 'vidstack/styles/community-skin/video.css';
import useElementStore from '../../../stores/elementStore';

interface VideoProps {
  element: BuilderElement;
}

export const Video: React.FC<VideoProps> = ({ element }) => {
  const { viewportMode, previewMode } = useCanvasStore();
  const { updateElement } = useElementStore();
  const styles = getCompleteElementStyles(element, viewportMode);
  const content = getElementContent(element);
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

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
        <div
          style={videoStyles}
          onDoubleClick={e => {
            if (previewMode === 'preview') return;
            e.preventDefault();
            e.stopPropagation();
            setUrlValue(src);
            setIsEditingUrl(true);
          }}
        >
          {isEditingUrl && previewMode === 'edit' && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '8px',
                right: '8px',
                display: 'flex',
                gap: '8px',
                background: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(4px)',
                padding: '8px',
                borderRadius: '6px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 5,
              }}
              onClick={e => e.stopPropagation()}
            >
              <input
                ref={inputRef}
                type="text"
                value={urlValue}
                onChange={e => setUrlValue(e.target.value)}
                placeholder="Paste video URL (mp4, m3u8, YouTube, Vimeo)"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    const newUrl = urlValue.trim();
                    updateElement(element.id, {
                      properties: {
                        ...element.properties,
                        content: {
                          ...(element.properties?.content as Record<string, unknown>),
                          src: newUrl,
                        },
                      },
                    });
                    setIsEditingUrl(false);
                  } else if (e.key === 'Escape') {
                    setIsEditingUrl(false);
                  }
                }}
                style={{
                  flex: 1,
                  height: '32px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  padding: '0 8px',
                  fontSize: '14px',
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const newUrl = urlValue.trim();
                  updateElement(element.id, {
                    properties: {
                      ...element.properties,
                      content: {
                        ...(element.properties?.content as Record<string, unknown>),
                        src: newUrl,
                      },
                    },
                  });
                  setIsEditingUrl(false);
                }}
                style={{
                  height: '32px',
                  padding: '0 10px',
                  background: '#5457ff',
                  color: '#fff',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditingUrl(false)}
                style={{
                  height: '32px',
                  padding: '0 10px',
                  background: 'transparent',
                  color: '#374151',
                  borderRadius: '4px',
                  border: '1px solid #d1d5db',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          )}
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
          {previewMode === 'edit' && src && (
            <div
              style={{
                marginTop: '8px',
                fontSize: '12px',
                color: '#6b7280',
                wordBreak: 'break-all',
              }}
              title={src}
            >
              {src}
            </div>
          )}
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
          onDoubleClick={e => {
            if (previewMode === 'preview') return;
            e.preventDefault();
            e.stopPropagation();
            setUrlValue('');
            setIsEditingUrl(true);
            setTimeout(() => inputRef.current?.focus(), 0);
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📹</div>
            <div>Add video URL or file</div>
            {previewMode === 'edit' && (
              <div style={{ marginTop: '8px' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={urlValue}
                  onChange={e => setUrlValue(e.target.value)}
                  placeholder="Paste video URL (mp4, m3u8, YouTube, Vimeo)"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const newUrl = urlValue.trim();
                      if (!newUrl) return;
                      updateElement(element.id, {
                        properties: {
                          ...element.properties,
                          content: {
                            ...(element.properties?.content as Record<string, unknown>),
                            src: newUrl,
                          },
                        },
                      });
                    }
                  }}
                  style={{
                    marginTop: '8px',
                    width: '360px',
                    maxWidth: '80vw',
                    height: '36px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '0 10px',
                    fontSize: '14px',
                  }}
                />
              </div>
            )}
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

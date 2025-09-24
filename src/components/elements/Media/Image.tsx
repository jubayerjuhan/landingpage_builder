import React, { useRef, useCallback } from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import { getElementStyles, getElementContent } from '../../../utils/styleUtils';
import useCanvasStore from '../../../stores/canvasStore';
import { useBuilderStore } from '../../../stores/builderStore';
import { processUploadedImage } from '../../../utils/uploadService';
import { Upload } from 'lucide-react';

interface ImageProps {
  element: BuilderElement;
}

export const Image: React.FC<ImageProps> = ({ element }) => {
  const { viewportMode } = useCanvasStore();
  const { updateElement } = useBuilderStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const styles = getElementStyles(element, viewportMode);
  const content = getElementContent(element);

  const imageStyles: React.CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '4px',
    ...styles,
  };

  const src = content.src;
  const alt = content.alt || 'Image';
  const hasImage = src && src !== '';

  const handleFileUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    try {
      const imageData = await processUploadedImage(file);

      // Update the element with the new image data
      updateElement(element.id, {
        content: {
          ...content,
          src: imageData.src,
          alt: imageData.alt || content.alt || 'Uploaded image',
        }
      });
    } catch (error) {
      console.error('Failed to upload image:', error);
    }
  }, [element.id, content, updateElement]);

  const handleClick = useCallback(() => {
    if (!hasImage && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [hasImage]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    if (!hasImage) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, [hasImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    if (!hasImage) {
      e.preventDefault();
      e.stopPropagation();
      handleFileUpload(e.dataTransfer.files);
    }
  }, [hasImage, handleFileUpload]);

  // Placeholder style for upload state
  const placeholderStyles: React.CSSProperties = {
    width: '100%',
    minHeight: '200px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    background: '#f3f4f6',
    border: '2px dashed #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ...styles,
  };

  if (!hasImage) {
    return (
      <ElementWrapper element={element} showSelectionChrome={false}>
        <div
          style={placeholderStyles}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="image-upload-placeholder"
        >
          <Upload size={32} color="#9ca3af" />
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: '#4b5563' }}>
              Click to upload image
            </p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#9ca3af' }}>
              or drag and drop
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      </ElementWrapper>
    );
  }

  return (
    <ElementWrapper element={element} showSelectionChrome={false}>
      <img
        src={src}
        alt={alt}
        style={imageStyles}
        loading="lazy"
      />
    </ElementWrapper>
  );
};

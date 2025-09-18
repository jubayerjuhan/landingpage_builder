import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Link } from 'lucide-react';
import {
  processUploadedImage,
  type UploadOptions,
  type UploadedImage,
} from '../../../utils/uploadService';
import styles from './ImageUpload.module.scss';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  onImageData?: (data: UploadedImage) => void;
  placeholder?: string;
  uploadOptions?: UploadOptions;
  allowUrl?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = '',
  onChange,
  onImageData,
  placeholder = 'Click to upload or drag & drop',
  uploadOptions,
  allowUrl = true,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const file = files[0];
      setIsLoading(true);
      setError(null);

      try {
        const imageData = await processUploadedImage(file, uploadOptions);
        onChange(imageData.src);

        if (onImageData) {
          onImageData(imageData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload image');
      } finally {
        setIsLoading(false);
      }
    },
    [onChange, onImageData, uploadOptions]
  );

  const handleClick = () => {
    if (!value && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setError(null);
    setUrlInput('');
    setShowUrlInput(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setShowUrlInput(false);
      setError(null);
    }
  };

  const handleUrlToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowUrlInput(!showUrlInput);
    if (!showUrlInput) {
      setUrlInput(value || '');
    }
  };

  const isDataUrl = value?.startsWith('data:');
  const hasImage = value && value !== '';

  return (
    <div className={styles.imageUpload}>
      {error && (
        <div className={styles.error}>
          <X size={14} />
          <span>{error}</span>
        </div>
      )}

      <div
        className={`${styles.uploadArea} ${isDragging ? styles.dragging : ''} ${
          hasImage ? styles.hasImage : ''
        }`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span>Processing image...</span>
          </div>
        )}

        {!isLoading && !hasImage && (
          <div className={styles.placeholder}>
            <Upload size={32} />
            <p className={styles.mainText}>{placeholder}</p>
            <p className={styles.subText}>PNG, JPG, GIF, WebP, SVG up to 10MB</p>
          </div>
        )}

        {!isLoading && hasImage && (
          <div className={styles.preview}>
            <img src={value} alt="Uploaded" onError={() => setError('Failed to load image')} />
            <div className={styles.overlay}>
              <button
                type="button"
                className={styles.removeButton}
                onClick={handleRemove}
                title="Remove image"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className={styles.fileInput}
          accept="image/*"
          onChange={e => handleFileSelect(e.target.files)}
        />
      </div>

      {allowUrl && (
        <div className={styles.urlSection}>
          {!showUrlInput ? (
            <button type="button" className={styles.urlToggle} onClick={handleUrlToggle}>
              <Link size={14} />
              <span>Use image URL</span>
            </button>
          ) : (
            <div className={styles.urlInput}>
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleUrlSubmit()}
                placeholder="https://example.com/image.jpg"
                className={styles.input}
              />
              <button type="button" onClick={handleUrlSubmit} className={styles.submitButton}>
                Apply
              </button>
              <button type="button" onClick={handleUrlToggle} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      {hasImage && (
        <div className={styles.imageInfo}>
          <ImageIcon size={14} />
          <span className={styles.infoText}>{isDataUrl ? 'Uploaded image' : 'External image'}</span>
        </div>
      )}
    </div>
  );
};

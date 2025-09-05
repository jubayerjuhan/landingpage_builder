import React from 'react';
import type { BuilderElement } from '../../../types/builder';
import { ElementWrapper } from '../ElementWrapper';
import styles from './Embed.module.scss';

interface EmbedProps {
  element: BuilderElement;
}

export const Embed: React.FC<EmbedProps> = ({ element }) => {
  const embedUrl = element.properties?.embedUrl || element.content || '';
  const aspectRatio = element.properties?.aspectRatio || '16:9';
  const allowFullscreen = element.properties?.allowFullscreen !== false;
  const title = element.properties?.title || 'Embedded content';

  // Detect embed type and transform URL if needed
  const getEmbedUrl = (url: string): string => {
    if (!url) return '';

    // YouTube
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }

    // Google Maps
    if (url.includes('maps.google.com') || url.includes('goo.gl/maps')) {
      return url.replace('/maps/', '/maps/embed/');
    }

    // Twitter/X
    if (url.includes('twitter.com') || url.includes('x.com')) {
      // For tweets, we'd need to use Twitter's embed API
      // For now, return as-is
      return url;
    }

    // CodePen
    if (url.includes('codepen.io/pen/')) {
      return url.replace('/pen/', '/embed/');
    }

    // Return as-is for other URLs or already formatted embed URLs
    return url;
  };

  const embedSrc = getEmbedUrl(embedUrl);

  if (!embedSrc) {
    return (
      <ElementWrapper element={element}>
        <div className={styles.embedPlaceholder}>
          <p>Enter an embed URL in the properties panel</p>
          <small>Supports: YouTube, Vimeo, Google Maps, CodePen, and more</small>
        </div>
      </ElementWrapper>
    );
  }

  // Calculate padding for aspect ratio
  const getPaddingBottom = () => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return `${(height / width) * 100}%`;
  };

  return (
    <ElementWrapper element={element}>
      <div className={styles.embed}>
        <div 
          className={styles.embedContainer}
          style={{ paddingBottom: getPaddingBottom() }}
        >
          <iframe
            src={embedSrc}
            title={title}
            allowFullScreen={allowFullscreen}
            className={styles.embedIframe}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>
      </div>
    </ElementWrapper>
  );
};
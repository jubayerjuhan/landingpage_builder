import type { BuilderElement } from '../types/builder';

type ElementLike = BuilderElement | Record<string, unknown> | null | undefined;

export interface VideoConfig {
  src: string;
  source: string | { src: string; type?: string };
  poster?: string;
  title?: string;
  autoplay: boolean;
  controls: boolean;
  muted: boolean;
  loop: boolean;
}

const normalizeBoolean = (value: unknown, fallback: boolean): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) return true;
    if (['false', '0', 'no', 'off'].includes(normalized)) return false;
  }
  if (typeof value === 'number') return value !== 0;
  return fallback;
};

const toStringOrEmpty = (value: unknown): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  return '';
};

const toRecord = (value: unknown): Record<string, unknown> | undefined => {
  if (value && typeof value === 'object') {
    return value as Record<string, unknown>;
  }
  return undefined;
};

const inferMimeType = (src: string): string | undefined => {
  const cleanSrc = src.split('?')[0].split('#')[0];
  const extension = cleanSrc.slice(cleanSrc.lastIndexOf('.') + 1).toLowerCase();
  switch (extension) {
    case 'mp4':
      return 'video/mp4';
    case 'webm':
      return 'video/webm';
    case 'ogg':
    case 'ogv':
      return 'video/ogg';
    case 'm3u8':
      return 'application/x-mpegURL';
    case 'mpd':
      return 'application/dash+xml';
    default:
      return undefined;
  }
};

const getContentObject = (element: ElementLike): Record<string, unknown> => {
  const asRecord = toRecord(element);
  if (!asRecord) return {};

  const directContent = toRecord(asRecord.content);
  if (directContent) return directContent;

  const properties = toRecord(asRecord.properties);
  if (!properties) return {};
  const content = toRecord(properties.content);
  return content || {};
};

const getComponentProps = (element: ElementLike): Record<string, unknown> => {
  const properties = toRecord(toRecord(element)?.properties);
  const component = toRecord(properties?.component);
  return component || {};
};

const getLegacyVideoSource = (element: ElementLike): string => {
  const record = toRecord(element);
  if (!record) return '';

  const sourceCandidates = [
    record.videoUrl,
    record.embedUrl,
    record.src,
    record.url,
    typeof record.content === 'string' ? record.content : undefined
  ];

  const match = sourceCandidates.find((candidate): candidate is string => typeof candidate === 'string');
  return match ?? '';
};

export const getVideoConfigFromElement = (element: BuilderElement | Record<string, unknown>): VideoConfig => {
  const content = getContentObject(element);
  const componentProps = getComponentProps(element);
  const elementRecord = toRecord(element) || {};

  const src = toStringOrEmpty(
    content.src ??
      componentProps.src ??
      getLegacyVideoSource(element)
  ).trim();

  const normalizedSrc = src;
  const lowerSrc = normalizedSrc.toLowerCase();
  const isYouTube = lowerSrc.includes('youtube.com/watch') || lowerSrc.includes('youtu.be/');
  const isVimeo = lowerSrc.includes('vimeo.com/');
  const mimeType = inferMimeType(normalizedSrc);
  const source = isYouTube
    ? { src: normalizedSrc, type: 'video/youtube' }
    : isVimeo
      ? { src: normalizedSrc, type: 'video/vimeo' }
      : mimeType
        ? { src: normalizedSrc, type: mimeType }
        : normalizedSrc;

  const poster = toStringOrEmpty(
    content.poster ??
      componentProps.poster ??
      (elementRecord.posterUrl as string | undefined)
  ).trim() || undefined;

  const title = toStringOrEmpty(
    content.title ??
      componentProps.title ??
      (elementRecord.title as string | undefined)
  ).trim() || undefined;

  const autoplay = normalizeBoolean(
    componentProps.autoplay ?? (elementRecord.autoplay as unknown),
    false
  );

  // Default controls to true unless explicitly disabled
  const controls = normalizeBoolean(
    componentProps.controls ?? (elementRecord.showControls as unknown) ?? (elementRecord.controls as unknown),
    true
  );

  const muted = normalizeBoolean(
    componentProps.muted ?? (elementRecord.muted as unknown),
    autoplay // browsers require muted when autoplaying video
  );

  const loop = normalizeBoolean(
    componentProps.loop ?? (elementRecord.loop as unknown),
    false
  );

  return {
    src,
    source,
    poster,
    title,
    autoplay,
    controls,
    muted,
    loop,
  };
};

export const hasVideoSource = (config: VideoConfig): boolean => Boolean(config.src);

const escapeHtmlAttribute = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

export const VIDSTACK_CDN_SCRIPT = 'https://cdn.vidstack.io/player/latest/vidstack.js';
export const VIDSTACK_CDN_STYLE = 'https://cdn.vidstack.io/player/latest/vidstack.css';
export const VIDSTACK_CDN_DEFAULT_LAYOUT_SCRIPT = 'https://cdn.vidstack.io/player/latest/vidstack-layouts-default.js';
export const VIDSTACK_CDN_DEFAULT_LAYOUT_STYLE = 'https://cdn.vidstack.io/player/latest/vidstack-layouts-default.css';
export const VIDSTACK_CDN_YOUTUBE_PROVIDER = 'https://cdn.vidstack.io/player/latest/vidstack-youtube.js';
export const VIDSTACK_CDN_VIMEO_PROVIDER = 'https://cdn.vidstack.io/player/latest/vidstack-vimeo.js';

export const buildVidstackHtml = (config: VideoConfig): string => {
  if (!config.src) {
    return '';
  }

  const source = typeof config.source === 'string' ? { src: config.source } : config.source;
  if (!source?.src) {
    return '';
  }

  const providerType = source.type;
  const attributes = [
    `src="${escapeHtmlAttribute(source.src)}"`,
    config.poster ? `poster="${escapeHtmlAttribute(config.poster)}"` : '',
    config.title ? `title="${escapeHtmlAttribute(config.title)}"` : '',
    config.autoplay ? 'autoplay' : '',
    config.muted ? 'muted' : '',
    config.loop ? 'loop' : '',
    'playsinline'
  ].filter(Boolean);

  const providerMarkup = providerType === 'video/youtube'
    ? '  <youtube-provider></youtube-provider>'
    : providerType === 'video/vimeo'
      ? '  <vimeo-provider></vimeo-provider>'
      : '';

  return [
    `<media-player ${attributes.join(' ')}>`,
    '  <media-provider></media-provider>',
    providerMarkup,
    '  <media-outlet></media-outlet>',
    config.controls !== false ? '  <media-default-layout></media-default-layout>' : '',
    '</media-player>'
  ].join('\n');
};

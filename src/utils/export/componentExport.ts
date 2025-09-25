import { COMPONENT_DEFINITIONS } from '../../components/definitions/componentDefinitions';
import type { BuilderElement } from '../../types/builder';
import { ComponentType } from '../../types/builder';
import { createHtmlDocument } from './htmlDocument';

export interface ComponentExportPayload {
  html: string;
  assets: {
    scripts: string[];
    styles: string[];
  };
}

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

export const getComponentExportPayload = (element: BuilderElement): ComponentExportPayload | null => {
  const definition = COMPONENT_DEFINITIONS[element.type as ComponentType];
  const exportConfig = definition?.exportConfig;

  if (!exportConfig) {
    return null;
  }

  const html = exportConfig.html(element);
  if (!html) {
    return null;
  }

  const scripts = exportConfig.assets?.scripts ?? [];
  const styles = exportConfig.assets?.styles ?? [];

  return {
    html,
    assets: {
      scripts: unique(scripts),
      styles: unique(styles)
    }
  };
};

export const mergeExportAssets = (payloads: Array<ComponentExportPayload | null>) => {
  const scripts = unique(
    payloads
      .flatMap(payload => payload?.assets.scripts ?? [])
  );

  const styles = unique(
    payloads
      .flatMap(payload => payload?.assets.styles ?? [])
  );

  return { scripts, styles };
};

export const buildStaticMarkup = (elements: BuilderElement[]) => {
  const payloads = elements.map(getComponentExportPayload);
  const body = payloads
    .filter((payload): payload is ComponentExportPayload => Boolean(payload))
    .map(payload => payload.html)
    .join('\n');

  const assets = mergeExportAssets(payloads);

  return {
    body,
    assets
  };
};

export const buildHtmlDocumentFromElements = (elements: BuilderElement[]) => {
  const { body, assets } = buildStaticMarkup(elements);
  return createHtmlDocument(body, assets);
};

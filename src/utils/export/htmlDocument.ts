interface ExportAssets {
  scripts: string[];
  styles: string[];
}

export const createHtmlDocument = (body: string, assets: ExportAssets) => {
  const styleTags = assets.styles
    .map(href => `<link rel="stylesheet" href="${href}" />`)
    .join('\n');

  const scriptTags = assets.scripts
    .map(src => `<script type="module" src="${src}"></script>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    ${styleTags}
  </head>
  <body>
${body}
${scriptTags}
  </body>
</html>`;
};


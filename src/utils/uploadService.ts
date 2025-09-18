/**
 * Image Upload Service
 * Handles file validation, conversion, and processing for image uploads
 */

export interface UploadedImage {
  src: string; // Base64 data URL or URL
  alt?: string;
  width?: number;
  height?: number;
  size?: number; // File size in bytes
  type?: string; // MIME type
}

export interface UploadOptions {
  maxSizeInMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  acceptedFormats?: string[];
  quality?: number; // JPEG quality 0-1
}

const DEFAULT_OPTIONS: UploadOptions = {
  maxSizeInMB: 10,
  maxWidth: 2400,
  maxHeight: 2400,
  acceptedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  quality: 0.9,
};

/**
 * Validates an image file against specified constraints
 */
export const validateImage = (file: File, options: UploadOptions = {}): string | null => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Check file type
  if (opts.acceptedFormats && !opts.acceptedFormats.includes(file.type)) {
    const formats = opts.acceptedFormats.map(f => f.split('/')[1]).join(', ');
    return `Please upload a valid image format (${formats})`;
  }

  // Check file size
  const sizeInMB = file.size / (1024 * 1024);
  if (opts.maxSizeInMB && sizeInMB > opts.maxSizeInMB) {
    return `Image size must be less than ${opts.maxSizeInMB}MB`;
  }

  return null;
};

/**
 * Converts a File to a base64 data URL
 */
export const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Gets image dimensions from a data URL
 */
export const getImageDimensions = (dataUrl: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    img.src = dataUrl;
  });
};

/**
 * Resizes an image to fit within max dimensions while maintaining aspect ratio
 */
export const resizeImage = async (
  dataUrl: string,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.9
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      let { naturalWidth: width, naturalHeight: height } = img;

      // Calculate new dimensions
      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;

        if (width > height) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to data URL
      const resizedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(resizedDataUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for resizing'));
    };

    img.src = dataUrl;
  });
};

/**
 * Main function to process uploaded image
 */
export const processUploadedImage = async (
  file: File,
  options: UploadOptions = {}
): Promise<UploadedImage> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Validate file
  const validationError = validateImage(file, opts);
  if (validationError) {
    throw new Error(validationError);
  }

  // Convert to data URL
  let dataUrl = await fileToDataUrl(file);

  // Get dimensions
  const dimensions = await getImageDimensions(dataUrl);

  // Resize if needed
  if (opts.maxWidth && opts.maxHeight) {
    if (dimensions.width > opts.maxWidth || dimensions.height > opts.maxHeight) {
      dataUrl = await resizeImage(dataUrl, opts.maxWidth, opts.maxHeight, opts.quality);
      // Update dimensions after resize
      const newDimensions = await getImageDimensions(dataUrl);
      dimensions.width = newDimensions.width;
      dimensions.height = newDimensions.height;
    }
  }

  return {
    src: dataUrl,
    alt: file.name.split('.')[0], // Use filename without extension as default alt
    width: dimensions.width,
    height: dimensions.height,
    size: file.size,
    type: file.type,
  };
};

/**
 * Checks if a string is a valid data URL
 */
export const isDataUrl = (str: string): boolean => {
  return str.startsWith('data:');
};

/**
 * Checks if a string is a valid image URL
 */
export const isValidImageUrl = (str: string): boolean => {
  try {
    const url = new URL(str);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url.pathname);
  } catch {
    return false;
  }
};

/**
 * Gets a placeholder image URL with specific dimensions
 */
export const getPlaceholderImage = (width: number = 400, height: number = 300): string => {
  return `https://via.placeholder.com/${width}x${height}/e5e7eb/6b7280?text=Upload+Image`;
};
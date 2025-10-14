export default function customImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
  // For local assets (starting with /), return as-is
  if (src.startsWith('/')) {
    return src;
  }

  // For S3 images, proxy them through our API to handle CORS
  if (src.includes('flipitimages1.s3.amazonaws.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(src)}&w=${width}&q=${quality || 75}`;
  }

  // For external images (Pexels, Unsplash), return as-is
  return src;
}

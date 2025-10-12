export default function customImageLoader({ src }: { src: string }) {
  // Return the URL as-is for pre-signed S3 URLs and external images
  return src;
}

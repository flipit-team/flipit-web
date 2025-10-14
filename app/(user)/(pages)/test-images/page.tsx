'use client';

import Image from 'next/image';

export default function TestImages() {
  const testUrls = [
    'https://flipitimages1.s3.amazonaws.com/uploads/fd0e23c9-c400-4cab-90ee-627782e46a89_item-image-1760477716203-0.jpg',
    'https://images.unsplash.com/photo-1592286927505-b0e6e1b0b60f?w=800',
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Image Test Page</h1>

      <div className="mb-8">
        <h2 className="text-xl mb-2">Test 1: Next.js Image Component (S3)</h2>
        <Image
          src={testUrls[0]}
          alt="S3 Test"
          width={400}
          height={300}
          onError={(e) => console.error('Next Image failed to load:', e)}
          onLoad={() => console.log('Next Image loaded successfully')}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-2">Test 2: Regular img tag (S3)</h2>
        <img
          src={testUrls[0]}
          alt="S3 Test"
          width={400}
          height={300}
          onError={(e) => console.error('Regular img failed to load:', e)}
          onLoad={() => console.log('Regular img loaded successfully')}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-2">Test 3: Next.js Image Component (Unsplash)</h2>
        <Image
          src={testUrls[1]}
          alt="Unsplash Test"
          width={400}
          height={300}
          onError={(e) => console.error('Unsplash Image failed to load:', e)}
          onLoad={() => console.log('Unsplash Image loaded successfully')}
        />
      </div>

      <div className="mb-8">
        <h2 className="text-xl mb-2">Test 4: Background Image CSS (S3)</h2>
        <div
          style={{
            backgroundImage: `url(${testUrls[0]})`,
            backgroundSize: 'cover',
            width: '400px',
            height: '300px'
          }}
        />
      </div>
    </div>
  );
}

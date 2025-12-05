'use client';

import { useEffect } from 'react';
import { setupFetchInterceptor } from '~/lib/fetch-interceptor';

export default function AuthInterceptor() {
  useEffect(() => {
    setupFetchInterceptor();
  }, []);

  return null; // This component doesn't render anything
}

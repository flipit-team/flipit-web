'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SearchParamsComponent({ 
  children 
}: { 
  children: (searchParams: URLSearchParams | null) => React.ReactNode;
}) {
  const searchParams = useSearchParams();
  return <>{children(searchParams)}</>;
}

export function useSearchParamsSafe() {
  return {
    SearchParamsWrapper: ({ children }: { 
      children: (searchParams: URLSearchParams | null) => React.ReactNode;
    }) => (
      <Suspense fallback={<>{children(null)}</>}>
        <SearchParamsComponent>{children}</SearchParamsComponent>
      </Suspense>
    )
  };
}
'use client';
import ErrorPage from '~/ui/common/error-page';

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    return <ErrorPage />;
}

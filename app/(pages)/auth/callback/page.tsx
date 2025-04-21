import dynamic from 'next/dynamic';

// Dynamically import the client logic with suspense
const GoogleCallbackHandler = dynamic(() => import('../../../ui/wrappers/Callback'), {
    ssr: false,
    loading: () => <p>Loading...</p>
});

export default function Page() {
    return <GoogleCallbackHandler />;
}

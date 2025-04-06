//fetched for the useSWR
export const fetcher = async <T>(...args: [RequestInfo, RequestInit?]): Promise<T> => {
    const response = await fetch(...args);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data as T;
};

export const signupFetcher = async (url: string, {arg}: {arg: any}) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(arg)
    });

    if (!res.ok) throw new Error('Signup failed');
    return res.json();
};

export const loginFetcher = async (url: string, {arg}: {arg: any}) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // Add authorization headers if needed
        },
        body: JSON.stringify(arg)
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Login failed');
    }

    return res.json();
};

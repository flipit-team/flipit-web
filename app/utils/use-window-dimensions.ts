import {useEffect, useState} from 'react';

type WindowDimentions = {
    windowWidth: number | undefined;
    windowHeight: number | undefined;
};

export const useWindowDimensions = (): WindowDimentions => {
    const [windowDimensions, setWindowDimensions] = useState<WindowDimentions>({
        windowWidth: undefined,
        windowHeight: undefined
    });

    useEffect(() => {
        const handleResize = () => {
            setWindowDimensions({
                windowWidth: window.innerWidth,
                windowHeight: window.innerHeight
            });
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Empty array ensures that effect is only run on mount

    return windowDimensions;
};

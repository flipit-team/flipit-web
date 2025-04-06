'use client';
import React from 'react';
import Lottie from 'react-lottie';
import * as animationPurple from '../../../assets/animations/purple-loader.json';
import * as animationWhite from '../../../assets/animations/white-loader.json';
import * as animationAsh from '../../../assets/animations/loading-animation.json';
import * as animationGreen from '../../../assets/animations/green-loader.json';

export interface LoaderProps {
    color: 'purple' | 'white' | 'ash' | 'green';
    height?: number;
    width?: number;
}

const Loader = (props: LoaderProps) => {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData:
            props.color === 'purple'
                ? animationPurple
                : props.color === 'ash'
                  ? animationAsh
                  : props.color === 'green'
                    ? animationGreen
                    : animationWhite,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };
    return (
        <div>
            <Lottie
                options={defaultOptions}
                height={props?.height ? props.height : 45}
                width={props?.width ? props.width : 45}
                isStopped={false}
                isPaused={false}
            />
        </div>
    );
};

export default Loader;

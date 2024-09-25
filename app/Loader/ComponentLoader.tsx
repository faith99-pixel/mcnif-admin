import { FunctionComponent, ReactElement } from 'react';

type ComponentLoaderProps = {

    /**
     * The optional classnames to be added
     */
    className?: string
}

type FullPageLoaderProps = ComponentLoaderProps & {
    containerClassName?: string
}

export const ComponentLoader: FunctionComponent<ComponentLoaderProps> = (
    { className }): ReactElement => {

    return (
        <div className={`w-16 h-16 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin ${className}`} />
    );
}

export const ButtonLoader: FunctionComponent<ComponentLoaderProps> = (
    { className }): ReactElement => {

    return (
        <div className='absolute w-full h-full top-0 left-0 bg-primary grid place-items-center pointer-events-none'>
            <div className={`w-6 h-6 border-4 border-white border-t-transparent border-solid rounded-full animate-spin ${className}`} />
        </div>
    );
}

export const FullPageLoader: FunctionComponent<FullPageLoaderProps> = (
    { className, containerClassName }): ReactElement => {

    return (
        <div className={`h-52 w-full grid place-items-center ${containerClassName}`}>
            <div className={`w-12 h-12 border-4 border-primary border-t-transparent border-solid rounded-full animate-spin ${className}`} />
        </div>
    );
}
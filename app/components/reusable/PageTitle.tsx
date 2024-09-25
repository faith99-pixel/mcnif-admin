import { FunctionComponent, ReactElement } from "react";

interface PageTitleProps {
    title: string
    complimentaryButton?: ReactElement
    additonalContent?: ReactElement
    className?: string
}

const PageTitle: FunctionComponent<PageTitleProps> = ({ title, additonalContent, className, complimentaryButton }): ReactElement => {
    return (
        <div className={`mb-14 flex flex-row items-center justify-between ${className}`}>
            <div className="flex flex-row items-center gap-2">
                {complimentaryButton}
                <h2 className='text-mcNiff-gray-2 text-3xl'>{title}</h2>
            </div>
            {additonalContent}
        </div>
    );
}

export default PageTitle;
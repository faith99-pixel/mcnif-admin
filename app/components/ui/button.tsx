import * as React from "react"
import { ButtonLoader, ComponentLoader } from "../../Loader/ComponentLoader";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    btnIcon?: React.ReactElement;
    hideLoader?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, type, btnIcon, ...props }, ref) => {
        return (
            <button
                type={type}
                className={`bg-primary text-white font-medium py-3 px-6 rounded-full relative overflow-hidden hover:bg-primary-foreground hover:text:bg-primary ${className}`}
                ref={ref}
                {...props}
            >
                {btnIcon && <span>{btnIcon}</span>}
                {props.disabled && !props.hideLoader && <ButtonLoader />}
                {props.children}
            </button>
        );
    }
);

Button.displayName = "Button";

export default Button;

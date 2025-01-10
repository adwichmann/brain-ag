import React from "react";
import "./Button.css";
interface ButtonProps {
  children: React.ReactNode;
  textOnly?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  textOnly,
  className,
  ...props
}) => {
  const cssClass = textOnly
    ? `text-button ${className}`
    : `button ${className}`;
  return (
    <button className={cssClass} {...props}>
      {children}
    </button>
  );
};

export default Button;

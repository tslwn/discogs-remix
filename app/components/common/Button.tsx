import clsx from "clsx";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={clsx(
        "bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 font-semibold py-2 px-6 rounded-lg text-white",
        props.disabled
          ? "cursor-not-allowed opacity-50"
          : "hover:bg-neutral-600",
        className
      )}
    >
      {children}
    </button>
  );
}

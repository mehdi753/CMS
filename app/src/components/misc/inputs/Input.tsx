import { ReactNode } from "react";
import { classNames } from "../../../utils/helpers";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  state?: boolean;
  errorMessage?: string;
  icon?: ReactNode;
};
export function Input(props: InputProps) {
  const { icon, state, errorMessage, className, disabled, ...inputAttributes } =
    props;

  return (
    <div className={classNames("relative", className || "")}>
      {icon ? (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {icon}
        </div>
      ) : (
        <></>
      )}
      <input
        {...inputAttributes}
        className={classNames(
          "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5",
          typeof state !== "undefined" && !state
            ? "bg-red-50 border border-red-300 focus:ring-red-600 focus:border-red-600"
            : "bg-gray-50 border border-gray-300 focus:ring-blue-600 focus:border-blue-600",
          icon ? "pl-12" : "",
          disabled ? "cursor-not-allowed" : ""
        )}
        disabled={disabled}
      />
      {typeof state !== "undefined" &&
      !state &&
      typeof errorMessage !== "undefined" &&
      errorMessage ? (
        <p className="mt-2 text-sm text-red-600 font-medium">{errorMessage}</p>
      ) : (
        <></>
      )}
    </div>
  );
}

import { classNames } from "../../../utils/helpers";

type SelectProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  options: {
    name: string | number;
    value: string | number;
    disabled?: boolean;
  }[];
  state?: boolean;
  errorMessage?: string;
};
export function Select(props: SelectProps) {
  const { state, errorMessage, options, ...inputAttributes } = props;

  return (
    <>
      <select
        {...inputAttributes}
        className={classNames(
          "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 ",
          typeof state !== "undefined" && !state
            ? "bg-red-50 border border-red-300 focus:ring-red-600 focus:border-red-600"
            : "bg-gray-50 border border-gray-300 focus:ring-blue-600 focus:border-blue-600"
        )}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value} disabled={option.disabled}>
            {option.name}
          </option>
        ))}
      </select>
      {typeof state !== "undefined" &&
      !state &&
      typeof errorMessage !== "undefined" &&
      errorMessage ? (
        <p className="mt-2 text-sm text-red-600 font-medium">{errorMessage}</p>
      ) : (
        <></>
      )}
    </>
  );
}

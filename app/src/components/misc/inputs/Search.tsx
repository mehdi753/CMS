/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

type InputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  action: (v: string) => Promise<{ name: string; value: any }[]>;
  handleClick: (
    v: any,
    e?: React.MouseEvent<HTMLLIElement, MouseEvent>
  ) => void;
};
export function Search(props: InputProps) {
  const { action, handleClick, ...inputAttributes } = props;
  const [text, setText] = useState("");
  const [options, setOptions] = useState<{ name: string; value: string }[]>([]);

  const debouncedText = useDebounce(text, 300);

  useEffect(() => {
    if (debouncedText) {
      action(debouncedText).then((res) => setOptions(res));
    } else {
      setOptions([]);
    }
  }, [debouncedText]);

  return (
    <>
      <div className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
          </div>
          <input
            {...inputAttributes}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        {options.length ? (
          <ul className="absolute top-full left-0 right-0 z-50 border rounded bg-white">
            {options.map((o, i) => (
              <li
                key={i}
                className="flex justify-between cursor-pointer hover:bg-green-100 border-b-[1px] py-1 pl-2"
                onClick={(e) => {
                  handleClick(o.value, e);
                  setText("");
                  setOptions([]);
                }}
              >
                <span>{o.name}</span>
                <ArrowRightOnRectangleIcon className="text-green-600 pr-2 w-6 h-6" />
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

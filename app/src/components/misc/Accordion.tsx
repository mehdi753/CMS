import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { classNames } from "../../utils/helpers";

interface Props {
  draggable?: boolean;
  handleDragStart?: (e: React.DragEvent<HTMLDivElement>, i: number) => void;
  handleDrag?: (e: React.DragEvent<HTMLDivElement>, di: number) => void;
  list: {
    id: any;
    title: string;
    children?: React.ReactNode;
    removable?: boolean;
    removeAction?: (id: any) => void;
    collapsible?: boolean;
  }[];
}
const Accordion = ({ list, draggable, handleDragStart, handleDrag }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean[]>(list.map((_item) => false));

  const toggleAccordion = (index: number, collapsible?: boolean) => {
    if (collapsible) {
      const newIsOpen = [...isOpen];
      newIsOpen[index] = !newIsOpen[index];
      setIsOpen(newIsOpen);
    }
  };

  return (
    <div className="w-full">
      {list.map(
        (
          { id, title, children, removable, removeAction, collapsible },
          index
        ) => (
          <div
            className="w-full"
            key={index}
            draggable={draggable}
            onDragStart={(e) => {
              if (draggable && handleDragStart) {
                handleDragStart(e, index);
              }
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              if (draggable && handleDrag) {
                handleDrag(e, index);
              }
            }}
          >
            <div
              onClick={() => toggleAccordion(index, collapsible)}
              className={classNames(
                "flex justify-between bg-gray-50 p-4 border-gray-200 border hover:bg-gray-100",
                index === 0 ? "rounded-t-md" : "",
                collapsible ? "cursor-pointer" : ""
              )}
            >
              <span className="flex">
                {collapsible ? (
                  <button className="px-[3px] py-[3px] mr-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 hover:border-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm h-fit">
                    <ChevronDownIcon className={"w-5 h-5"} />
                  </button>
                ) : (
                  <div />
                )}
                <h3 className="font-semibold">{title}</h3>
              </span>
              {removable ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    if (removeAction) removeAction(id);
                  }}
                  className="px-[3px] py-[3px] text-red-600 hover:text-red-900 bg-white border border-red-300 hover:bg-red-100 hover:border-red-600 focus:outline-none focus:ring-4 focus:ring-red-200 font-medium rounded-full text-sm h-fit"
                >
                  <XMarkIcon className={"w-6 h-6"} />
                </button>
              ) : (
                <></>
              )}
            </div>
            {isOpen[index] ? (
              <div className="bg-gray-100 p-4 rounded-b-md">
                <div className="text-gray-700">{children}</div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default Accordion;

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React, {
  CSSProperties,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { ReactElement } from "react";

interface IItem {
  tabKey: string | number;
  label: string;
  active?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
const Item = ({ tabKey, label, active, onClick }: IItem) => {
  const activeStyle: CSSProperties = {
    borderBottomWidth: active ? "2px" : "0",
    borderBottomColor: active ? "#3b82f6" : "transparent",
    transition: "border-bottom-color 0.3s",
  };
  return (
    <button
      className={`px-4 py-2 focus:outline-none whitespace-nowrap`}
      style={activeStyle}
      onClick={onClick}
      key={`ITEM_${tabKey}`}
    >
      {label}
    </button>
  );
};

interface IPanel {
  active?: boolean;
  tabKey: string | number;
  children: ReactNode;
}
const Panel = ({ active, tabKey, children }: IPanel) =>
  active ? (
    <div className="w-full" key={`PANEL_${tabKey}`}>
      {children}
    </div>
  ) : (
    <></>
  );

interface IGroup {
  defaultActiveTab: string | number;
  children: ReactElement[];
}

const Group = ({ defaultActiveTab, children }: IGroup): ReactElement => {
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const [activeTab, setActiveTab] = useState<string | number>(defaultActiveTab);
  const tabsRef = useRef<HTMLDivElement>(null);
  const newChildren: ReactElement<IItem>[] = children
    .map((child) => child.props.children)
    .flat(1);

  const handleScrollLeft = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        top: 0,
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (tabsRef.current) {
      tabsRef.current.scrollBy({
        top: 0,
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const handleTabClick = (tab: string | number) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (tabsRef.current) {
      setShowScrollButtons(
        tabsRef.current.scrollWidth > tabsRef.current.clientWidth
      );
    }
  }, [children]);

  return (
    <div className="overflow-x-hidden">
      <div className="relative">
        {showScrollButtons ? (
          <button
            className="absolute left-0 top-0 z-10 px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700"
            onClick={handleScrollLeft}
          >
            <ChevronLeftIcon className="w-5 h-6" />
          </button>
        ) : (
          <></>
        )}
        <div
          className="flex border-b overflow-x-hidden relative pl-[46px] pr-[46px]"
          ref={tabsRef}
        >
          {React.Children.map(newChildren, (child) => {
            if (React.isValidElement(child) && child.type === Item) {
              return React.cloneElement<Partial<IItem>>(child, {
                active: activeTab === child.props.tabKey,
                onClick: () => handleTabClick(child.props.tabKey),
              });
            }
            return <></>;
          })}
        </div>
        {showScrollButtons ? (
          <button
            className="absolute right-0 top-0 z-10 px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700"
            onClick={handleScrollRight}
          >
            <ChevronRightIcon className="w-5 h-6" />
          </button>
        ) : (
          <></>
        )}
      </div>
      <div className="mt-4">
        {React.Children.map(newChildren, (child) => {
          if (React.isValidElement(child) && child.type === Panel) {
            return React.cloneElement<Partial<IItem>>(child, {
              active: activeTab === child.props.tabKey,
            });
          }
          return <></>;
        })}
      </div>
    </div>
  );
};

export const Tabs = {
  Group,
  Item,
  Panel,
};

import {
  ChartPieIcon,
  BuildingOffice2Icon,
  PlusCircleIcon,
  GlobeAltIcon,
  UsersIcon,
  UserCircleIcon,
  ClipboardIcon,
  RectangleGroupIcon,
  BriefcaseIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Route } from "../../../../@types/misc";

export const routes: Route[] = [
  {
    index: true,
    pathname: "",
    name: "Overview",
    icon: <ChartPieIcon className="w-5 h-5 text-gray-500 mr-1" />,
  },
  {
    pathname: "properties",
    name: "Properties",
    icon: <BuildingOffice2Icon className="w-5 h-5 text-gray-500 mr-1" />,
    children: [
      {
        pathname: "add",
        name: "Add property",
        icon: <PlusCircleIcon className="w-5 h-5 text-gray-500 mr-1" />,
      },
    ],
  },
  {
    pathname: "websites",
    name: "Websites",
    icon: <GlobeAltIcon className="w-5 h-5 text-gray-500 mr-1" />,
    children: [
      {
        pathname: ":id",
        name: "Website",
        icon: <PlusCircleIcon className="w-5 h-5 text-gray-500 mr-1" />,
        children: [
          {
            pathname: "features",
            name: "Features",
            icon: <RectangleGroupIcon className="w-5 h-5 text-gray-500 mr-1" />,
          },
        ],
      },
    ],
  },
  {
    pathname: "users",
    name: "Users",
    icon: <UsersIcon className="w-5 h-5 text-gray-500 mr-1" />,
    children: [
      {
        pathname: "add",
        name: "Add user",
        icon: <PlusCircleIcon className="w-5 h-5 text-gray-500 mr-1" />,
      },
    ],
  },
  {
    pathname: "documentation",
    name: "Documentation",
    icon: <ClipboardIcon className="w-5 h-5 text-gray-500 mr-1" />,
  },
  {
    pathname: "features",
    name: "Features",
    icon: <RectangleGroupIcon className="w-5 h-5 text-gray-500 mr-1" />,
  },
  {
    pathname: "support",
    name: "Support",
    icon: <BriefcaseIcon className="w-5 h-5 text-gray-500 mr-1" />,
  },
  {
    pathname: "profile",
    name: "Profile",
    icon: <UserCircleIcon className="w-5 h-5 text-gray-500 mr-1" />,
  },
  {
    pathname: "settings",
    name: "Settings",
    icon: <Cog6ToothIcon className="w-5 h-5 text-gray-500 mr-1" />,
  },
];

import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  RectangleGroupIcon,
  GlobeAltIcon,
  Bars4Icon,
  BuildingOffice2Icon,
  ChartPieIcon,
  ClipboardIcon,
  BriefcaseIcon,
  UsersIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAuth } from "../../hooks/useAuth";
import { classNames } from "../../utils/helpers";
import { routes } from "./pages/breadcrumb/BreadCrumbRoutes";
import { BreadCrumb } from "../misc/BreadCrumb";
import { Dropdown } from "flowbite-react";

const upperNavigation = [
  {
    name: "Overview",
    to: "",
    current: true,
    icon: (
      <ChartPieIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
    ),
  },
  {
    name: "Properties",
    to: "properties",
    current: false,
    icon: (
      <BuildingOffice2Icon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
    ),
  },
  {
    name: "Websites",
    to: "websites",
    current: false,
    icon: (
      <GlobeAltIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
    ),
  },
  {
    name: "Users",
    to: "users",
    current: false,
    icon: (
      <UsersIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
    ),
  },
];

const lowerNavigation = [
  {
    name: "Documentation",
    to: "documentation",
    current: true,
    icon: (
      <ClipboardIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
    ),
  },
  {
    name: "Features",
    to: "features",
    current: false,
    icon: (
      <RectangleGroupIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
    ),
  },
  {
    name: "Support",
    to: "support",
    current: false,
    icon: (
      <BriefcaseIcon className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
    ),
  },
];

const userNavigation = [
  { name: "Profile", to: "profile" },
  { name: "Settings", to: "settings" },
];

export function Dashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const auth = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleSignout = () => {
    auth.signout(() => {
      navigate("/");
    });
  };
  return (
    <div className="antialiased bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-40">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              data-drawer-target="drawer-navigation"
              data-drawer-toggle="drawer-navigation"
              aria-controls="drawer-navigation"
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-indigo-100 focus:bg-indigo-100 focus:ring-2 focus:ring-gray-100"
            >
              <Bars4Icon className="w-6 h-6" />
              <span className="sr-only">Toggle sidebar</span>
            </button>
            <span className="flex items-center justify-between mr-4">
              {/* <img src={QTLogo} className="mr-3 h-8" alt="Flowbite Logo" /> */}
              <span className="self-center text-xl font-semibold whitespace-nowrap">
                Content Manager
              </span>
            </span>
          </div>
          <div className="flex items-center lg:order-2 cm-drop-down">
            <Dropdown
              label={
                user.picture ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user.picture}
                    alt="user"
                  />
                ) : (
                  <UserCircleIcon className="w-5 h-5" />
                )
              }
              arrowIcon={false}
              color={"light"}
              pill
              dismissOnClick={true}
            >
              <Dropdown.Header>
                <span className="block text-sm">{`${user.firstName} ${user.lastName}`}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </Dropdown.Header>
              {userNavigation.map((item, index) => (
                <Link to={item.to} key={index}>
                  <Dropdown.Item
                    key={`USER-NAVIGATION-${item}-${index}`}
                    className={classNames(
                      `block py-2 px-4 text-sm`,
                      pathname ===
                        `/dashboard${(item.to && `/${item.to}`) || ""}`
                        ? "bg-indigo-100"
                        : "hover:bg-indigo-100"
                    )}
                  >
                    <span className="ml-3">{item.name}</span>
                  </Dropdown.Item>
                </Link>
              ))}
              <Dropdown.Divider />
              <Dropdown.Item
                onClick={handleSignout}
                className="block py-2 px-4 text-sm hover:bg-indigo-100"
              >
                Sign out
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </nav>

      <aside
        className="fixed top-0 left-0 z-30 w-64 h-screen pt-14 transition-transform -translate-x-full bg-white border-r border-gray-200 md:translate-x-0"
        aria-label="Sidenav"
        id="drawer-navigation"
      >
        <div className="overflow-y-auto py-5 px-3 h-full bg-white">
          <ul className="space-y-2">
            {upperNavigation.map((item, index) => (
              <li key={`UPPER-NAVIGATION-${item}-${index}`}>
                <Link
                  to={item.to}
                  className={classNames(
                    `flex items-center p-2 text-base font-medium  rounded-lg `,
                    pathname === `/dashboard${(item.to && `/${item.to}`) || ""}`
                      ? "bg-indigo-100 group"
                      : "text-gray-900 hover:bg-indigo-100 group"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <ul className="pt-5 mt-5 space-y-2 border-t border-gray-200">
            {lowerNavigation.map((item, index) => (
              <li key={`LOWER-NAVIGATION-${item}-${index}`}>
                <Link
                  to={item.to}
                  className={classNames(
                    `flex items-center p-2 text-base font-medium rounded-lg `,
                    pathname === `/dashboard${(item.to && `/${item.to}`) || ""}`
                      ? "bg-indigo-100 group"
                      : "text-gray-900 hover:bg-indigo-100 group"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden absolute bottom-0 left-0 justify-center p-4 space-x-4 w-full lg:flex bg-white z-20"></div>
      </aside>
      <main className="p-4 md:ml-64 pt-16 h-full overflow-y-auto">
        <BreadCrumb routes={routes} />
        <section className="h-auto mt-10">
          <Outlet />
        </section>
      </main>
    </div>
  );
}

Dashboard.displayName = "Dashboard";

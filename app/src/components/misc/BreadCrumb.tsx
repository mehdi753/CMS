import { Link, useLocation } from "react-router-dom";
import { Route } from "../../@types/misc";
import { Breadcrumb } from "flowbite-react";

interface Props {
  routes: Route[];
}

export function BreadCrumb({ routes }: Props) {
  const location = useLocation();

  const findRoute = (
    pathname: string,
    routes: Route[],
    prev?: string
  ): Route | null => {
    for (const route of routes) {
      if (route.pathname === pathname || route.pathname === ":id") {
        if (route.pathname === ":id") {
          route.pathname = pathname;
        }
        return route;
      } else if (prev === route.pathname && route.children) {
        const fRoute = findRoute(pathname, route.children, prev);
        if (fRoute) {
          return fRoute;
        }
      }
    }
    return null;
  };

  const generateBreadcrumb = (pathname: string, routes: Route[]) => {
    const breadcrumb = [];
    const paths = pathname.split("/");

    if (paths.filter((p) => p && p !== "dashboard").length) {
      let prevPath = "";
      for (const path of paths) {
        const route = findRoute(
          path,
          routes.filter((r) => !r.index),
          prevPath
        );
        if (route) {
          breadcrumb.push(route);
        }
        prevPath = path;
      }
    } else {
      const route = routes.find((r) => r.index);
      return (route && [route]) || [];
    }

    return breadcrumb;
  };

  const breadcrumb = generateBreadcrumb(location.pathname, routes);

  const getLink = (route: Route, index: number) => {
    if (breadcrumb[index - 1]) {
      let newPath = breadcrumb[0].pathname;
      for (let i = 1; i < index; i++) {
        newPath += `/${breadcrumb[i].pathname}`;
      }
      return `${newPath}/${route.pathname}`;
    }
    return route.pathname;
  };

  return (
    <Breadcrumb
      aria-label="navigation"
      className="mt-3 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50-700"
    >
      {breadcrumb.map((route, i) => (
        <Breadcrumb.Item key={i}>
          <Link
            to={getLink(route, i)}
            className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2 flex"
          >
            {route.icon}
            {route.name}
          </Link>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

BreadCrumb.displayName = "BreadCrumb";

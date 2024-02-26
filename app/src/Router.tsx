import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import { LoginGuard } from "./components/authentication/LoginGuard";
import { AuthGuard } from "./components/authentication/AuthGuard";
import { Suspense } from "react";
import { Loading } from "./components/misc/Loading";
import { useAuth } from "./hooks/useAuth";
import { ROLE } from "./@types/role";

export function useRouter() {
  const { authorize } = useAuth();

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <LoginGuard />
        </Suspense>
      ),
      children: [
        {
          index: true,
          lazy: async () => {
            const { Login } = await import("./components/authentication/Login");
            return { Component: Login };
          },
        },
        {
          path: "forgot-password",
          lazy: async () => {
            const { ForgotPassword } = await import(
              "./components/authentication/ForgotPassword"
            );
            return { Component: ForgotPassword };
          },
        },
        {
          path: "recover/:id",
          lazy: async () => {
            const { ResetPassword } = await import(
              "./components/authentication/ResetPassword"
            );
            return { Component: ResetPassword };
          },
        },
      ],
    },
    {
      path: "/",
      element: (
        <Suspense fallback={<Loading />}>
          <AuthGuard />
        </Suspense>
      ),
      children: [
        {
          path: "verify/:id",
          lazy: async () => {
            const { Verify } = await import("./components/verify/Verify");
            return { Component: Verify };
          },
        },
        {
          path: "dashboard",
          lazy: async () => {
            const { Dashboard } = await import(
              "./components/dashboard/Dashboard"
            );
            return { Component: Dashboard };
          },
          children: [
            {
              index: true,
              lazy: async () => {
                const { Home } = await import(
                  "./components/dashboard/pages/home/Home"
                );
                return { Component: Home };
              },
            },
            {
              path: "profile",
              lazy: async () => {
                const { Profile } = await import(
                  "./components/dashboard/pages/profile/Profile"
                );
                return { Component: Profile };
              },
            },
            {
              path: "settings",
              lazy: async () => {
                const { Settings } = await import(
                  "./components/dashboard/pages/settings/Settings"
                );
                return { Component: Settings };
              },
            },
            {
              path: "properties",
              children: [
                {
                  index: true,
                  lazy: async () => {
                    const { Properties } = await import(
                      "./components/dashboard/pages/properties/Properties"
                    );
                    return { Component: Properties };
                  },
                },
                authorize<RouteObject>(
                  [ROLE.SUPER_ADMIN],
                  () => ({
                    path: "add",
                    lazy: async () => {
                      const { AddProperty } = await import(
                        "./components/dashboard/pages/properties/pages/AddProperty"
                      );
                      return { Component: AddProperty };
                    },
                  }),
                  () => ({
                    path: "add",
                    element: <Navigate to="/dashboard/properties" replace />,
                  })
                ),
              ],
            },
            {
              path: "websites",
              children: [
                {
                  index: true,
                  lazy: async () => {
                    const { Websites } = await import(
                      "./components/dashboard/pages/websites/Websites"
                    );
                    return { Component: Websites };
                  },
                },
                {
                  path: ":id",
                  children: [
                    {
                      index: true,
                      lazy: async () => {
                        const { Website } = await import(
                          "./components/dashboard/pages/websites/pages/Website"
                        );
                        return { Component: Website };
                      },
                    },
                    {
                      path: "features",
                      lazy: async () => {
                        const { Features } = await import(
                          "./components/dashboard/pages/websites/pages/Features"
                        );
                        return { Component: Features };
                      },
                    },
                  ],
                },
              ],
            },
            {
              path: "users",
              children: [
                {
                  index: true,
                  lazy: async () => {
                    const { Users } = await import(
                      "./components/dashboard/pages/users/Users"
                    );
                    return { Component: Users };
                  },
                },
                authorize<RouteObject>(
                  [ROLE.SUPER_ADMIN, ROLE.ADMIN],
                  () => ({
                    path: "add",
                    lazy: async () => {
                      const { AddUser } = await import(
                        "./components/dashboard/pages/users/pages/AddUser"
                      );
                      return { Component: AddUser };
                    },
                  }),
                  () => ({
                    path: "add",
                    element: <Navigate to="/dashboard/users" replace />,
                  })
                ),
              ],
            },
            {
              path: "documentation",
              lazy: async () => {
                const { Documentation } = await import(
                  "./components/dashboard/pages/documentation/Documentation"
                );
                return { Component: Documentation };
              },
            },
            {
              path: "features",
              lazy: async () => {
                const { Features } = await import(
                  "./components/dashboard/pages/features/Features"
                );
                return { Component: Features };
              },
            },
            {
              path: "support",
              lazy: async () => {
                const { Support } = await import(
                  "./components/dashboard/pages/support/Support"
                );
                return { Component: Support };
              },
            },
          ],
        },
        {
          path: "*",
          lazy: async () => {
            const { NotFound } = await import("./components/error/404");
            return { Component: NotFound };
          },
        },
      ],
    },
  ]);

  return router;
}

import { RouterProvider } from "react-router-dom";
import { useRouter } from "./Router";
import "./App.scss";
import "flowbite";

export default function App() {
  const router = useRouter();
  return <RouterProvider router={router}></RouterProvider>;
}

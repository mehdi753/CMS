import { useLoaderData } from "react-router-dom";

export function Admin() {
  const data = useLoaderData() as string;
  return (
    <div>
      <h2>Hello Admin</h2>
      <p>{data}</p>
    </div>
  );
}

Admin.displayName = "Admin";

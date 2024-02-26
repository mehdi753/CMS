import { useLoaderData } from "react-router-dom";

export function NotFound() {
  const data = useLoaderData() as string;
  return (
    <div>
      <h2>404 Not found</h2>
      <p>{data}</p>
    </div>
  );
}

NotFound.displayName = "Not found";

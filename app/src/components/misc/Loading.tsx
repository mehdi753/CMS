import { Spinner } from "flowbite-react";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Spinner color="purple" />
      </div>
    </div>
  );
}

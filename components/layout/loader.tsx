import { LoaderCircle } from "lucide-react";

export default function Loader() {
  return (
    <LoaderCircle
      role="status"
      aria-label="Loading"
      className="text-primary size-10 animate-spin"
    />
  );
}

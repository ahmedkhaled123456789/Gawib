import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="animate-spin rounded-full h-8 w-8 ">
        <Loader2 className="h-8 w-8 text-gray-900" />
      </div>
    </div>
  );
};

export default Loader;

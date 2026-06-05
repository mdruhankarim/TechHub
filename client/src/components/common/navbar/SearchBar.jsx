import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function SearchBar() {
  return (
    <div className="hidden md:flex flex-1 max-w-xs items-center border border-gray-200 rounded-md px-3 py-1.5 gap-2 bg-white focus-within:ring-1 focus-within:ring-gray-300">
      <Input
        placeholder="Search..."
        className="border-0 bg-transparent p-0 h-auto text-sm focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none placeholder:text-gray-400"
      />
      <Search className="w-3.5 h-3.5 text-gray-400 shrink-0" />
    </div>
  );
}

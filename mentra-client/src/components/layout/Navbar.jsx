import { Bell, Search } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10">

      <div className="flex items-center gap-4">

        <Search />

        <input
          placeholder="Search lessons..."
          className="outline-none"
        />

      </div>

      <div className="flex items-center gap-6">

        <Bell />

        <img
          src="https://i.pravatar.cc/100"
          className="w-10 h-10 rounded-full"
        />

      </div>

    </header>
  );
}
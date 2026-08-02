import {
  LayoutDashboard,
  Route,
  BookOpen,
  MessageSquare,
  FolderKanban,
  Brain,
  Settings,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Roadmaps",
    icon: Route,
    path: "/roadmaps",
  },
  {
    name: "Lessons",
    icon: BookOpen,
    path: "/lessons",
  },
  {
    name: "AI Mentor",
    icon: MessageSquare,
    path: "/mentor",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
  {
    name: "Flashcards",
    icon: Brain,
    path: "/flashcards",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col">
      <div className="p-8">
        <h1 className="text-3xl font-bold text-emerald-600">
          Mentra
        </h1>
      </div>

      <nav className="flex-1 px-4">
        {menu.map((item) => (
          <button
            key={item.name}
            className="w-full flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-emerald-50 transition"
          >
            <item.icon size={20} />

            <span>{item.name}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
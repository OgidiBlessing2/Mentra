import {
  LayoutDashboard,
  Route,
  BookOpen,
  MessageSquare,
  FolderKanban,
  Brain,
  StickyNote,
  Settings,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  useUser,
} from "@clerk/clerk-react";

import { NavLink } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard.js";



export default function Sidebar() {
   
  const { data } = useDashboard();

  const currentLessonId =
    data?.dashboard?.currentLesson?.id;
const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Learning Path",
    icon: Route,
    path: "/roadmaps",
  },
 {
  name: "Lessons",
  icon: BookOpen,
  path: currentLessonId
    ? `/lessons/${currentLessonId}`
    : "/dashboard",
},
  {
  name: "Notes",
  icon: StickyNote,
  path: "/notes",
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

  const { user } = useUser();
  return (
    <aside className="w-72 min-h-screen bg-[#111827] border-r border-white/10 flex flex-col">

      {/* Logo */}

      <div className="px-8 pt-8 pb-10">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">

            <Sparkles className="text-white" size={22} />

          </div>

          <div>

            <h1 className="text-2xl font-black text-white">

              Mentra

            </h1>

            <p className="text-slate-400 text-sm">

              Learn Smarter

            </p>

          </div>

        </div>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-4 space-y-2">

        {menu.map((item) => {

          const Icon = item.icon;

          return (

            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-2xl px-5 py-4 transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >

              <div className="flex items-center gap-4">

                <Icon size={20} />

                <span className="font-medium">

                  {item.name}

                </span>

              </div>

              <ChevronRight
                size={18}
                className="opacity-0 group-hover:opacity-100 transition"
              />

            </NavLink>

          );

        })}

      </nav>

      {/* User */}

      <div className="p-5 border-t border-white/10">

        <div className="rounded-3xl bg-white/5 p-4">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold">

              M

            </div>
<h3 className="font-semibold text-white">
{user?.firstName}
</h3>

<p className="text-sm text-slate-400">
{user?.primaryEmailAddress?.emailAddress}
</p>

          </div>

        </div>

      </div>

    </aside>
  );
}
import {
  LayoutDashboard,
  Route,
  BookOpen,
  Bookmark,
  MessageSquare,
  FolderKanban,
  Brain,
  Settings,
  Sparkles,
  ChevronRight,
  StickyNote,
  X,
} from "lucide-react";

import { useUser } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard.js";

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {
  const { data } = useDashboard();
  const { user } = useUser();

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
      name: "Bookmarks",
      icon: Bookmark,
      path: "/bookmarks",
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

  return (
    <>
      {/* Mobile overlay */}
      <div
        onClick={() => setSidebarOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Sidebar */}
    <aside
  className={`
    fixed inset-y-0 left-0 z-50
    flex w-72 shrink-0 flex-col
    border-r border-white/10 bg-[#111827]
    transition-transform duration-300
    lg:static lg:flex
    ${
      sidebarOpen
        ? "translate-x-0"
        : "-translate-x-full lg:translate-x-0"
    }
  `}
>

  <div className="flex justify-end p-4 lg:hidden">
  <button
    onClick={() => setSidebarOpen(false)}
    className="rounded-xl p-2 text-slate-400 hover:bg-white/5 hover:text-white"
  >
    ✕
  </button>
</div>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 pb-8 pt-8 lg:px-8 lg:pb-10">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg shadow-violet-500/20">
              <Sparkles
                className="text-white"
                size={22}
              />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white">
                Mentra
              </h1>

              <p className="text-sm text-slate-400">
                Learn Smarter
              </p>
            </div>

          </div>

          {/* Mobile close */}
  <button
    onClick={() => setSidebarOpen(false)}
    className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-white lg:hidden"
  >
    <X size={22} />
  </button>

</div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto px-4">

          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
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
                  className="opacity-0 transition group-hover:opacity-100"
                />

              </NavLink>
            );
          })}

        </nav>

        {/* User */}
        <div className="border-t border-white/10 p-5">

          <div className="rounded-3xl bg-white/5 p-4">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 font-bold text-white">
                {user?.firstName?.charAt(0) || "M"}
              </div>

              <div className="min-w-0">

                <h3 className="truncate font-semibold text-white">
                  {user?.firstName || "User"}
                </h3>

                <p className="truncate text-sm text-slate-400">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>

              </div>

            </div>

          </div>

        </div>

      </aside>
    </>
  );
}
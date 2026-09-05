import { useUser } from "@clerk/clerk-react";
import {
  User,
  Palette,
  Bell,
  BookOpen,
  Shield,
  Check,
} from "lucide-react";

import { useTheme } from "../../context/ThemeContext";

export default function Settings() {
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--mentra-bg)] px-4 py-8 text-[var(--mentra-text)] transition-colors duration-200 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="mt-2 text-[var(--mentra-text-muted)]">
            Customize your Mentra experience.
          </p>
        </div>

        {/* PROFILE */}
        <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
          <SectionHeader
            icon={User}
            title="Profile"
            description="Your Mentra account"
          />

          <div className="flex items-center gap-4 rounded-2xl bg-[var(--mentra-surface-2)] p-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-xl font-bold text-white">
              {user?.firstName?.charAt(0) || "M"}
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-[var(--mentra-text)]">
                {user?.fullName ||
                  user?.firstName ||
                  "Mentra User"}
              </p>

              <p className="truncate text-sm text-[var(--mentra-text-muted)]">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        </section>

        {/* APPEARANCE */}
        <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
          <SectionHeader
            icon={Palette}
            title="Appearance"
            description="Control how Mentra looks."
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <ThemeOption
              title="Dark"
              description="Easy on the eyes in low light."
              active={theme === "dark"}
              onClick={() => setTheme("dark")}
            />

            <ThemeOption
              title="Light"
              description="A brighter, cleaner interface."
              active={theme === "light"}
              onClick={() => setTheme("light")}
            />
          </div>
        </section>

        {/* NOTIFICATIONS */}
        <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
          <SectionHeader
            icon={Bell}
            title="Notifications"
            description="Manage your learning reminders."
          />

          <div className="space-y-3">
            <SettingRow
              title="Lesson reminders"
              description="Get reminded to continue your learning."
            />

            <SettingRow
              title="Streak reminders"
              description="Don't lose your learning streak."
            />

            <SettingRow
              title="Achievement notifications"
              description="Get notified when you unlock achievements."
            />
          </div>
        </section>

        {/* LEARNING */}
        <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
          <SectionHeader
            icon={BookOpen}
            title="Learning"
            description="Customize your learning experience."
          />

          <div className="space-y-3">
            <SettingRow
              title="Daily learning goal"
              description="Set how much you want to learn each day."
            />

            <SettingRow
              title="Learning reminders"
              description="Receive reminders about your learning plan."
            />
          </div>
        </section>

        {/* ACCOUNT */}
        <section className="rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
          <SectionHeader
            icon={Shield}
            title="Account"
            description="Manage your Mentra account."
          />

          <div className="rounded-2xl bg-[var(--mentra-surface-2)] p-4">
            <p className="font-medium text-[var(--mentra-text)]">
              Account security
            </p>

            <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
              Your authentication is securely managed by Clerk.
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}

/* ============================= */
/* SECTION HEADER */
/* ============================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="font-semibold text-[var(--mentra-text)]">
          {title}
        </h2>

        <p className="text-sm text-[var(--mentra-text-subtle)]">
          {description}
        </p>
      </div>
    </div>
  );
}

/* ============================= */
/* THEME OPTION */
/* ============================= */

function ThemeOption({
  title,
  description,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-2xl border p-5 text-left transition-all duration-200 ${
        active
          ? "border-violet-500 bg-violet-500/10 shadow-lg shadow-violet-500/10"
          : "border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] hover:bg-black/5"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-[var(--mentra-text)]">
            {title}
          </p>

          <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
            {description}
          </p>
        </div>

        {active && (
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600">
            <Check
              size={14}
              className="text-white"
            />
          </div>
        )}
      </div>
    </button>
  );
}

/* ============================= */
/* SETTING ROW */
/* ============================= */

function SettingRow({
  title,
  description,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 transition-colors duration-200">
      <div>
        <p className="font-medium text-[var(--mentra-text)]">
          {title}
        </p>

        <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
          {description}
        </p>
      </div>

      <div className="h-6 w-11 shrink-0 rounded-full bg-violet-600 p-1">
        <div className="h-4 w-4 translate-x-5 rounded-full bg-white shadow" />
      </div>
    </div>
  );
}
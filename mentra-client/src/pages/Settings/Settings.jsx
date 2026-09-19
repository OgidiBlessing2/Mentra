import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";
import {
  User,
  Palette,
  Bell,
  BookOpen,
  Shield,
  Check,
  Target,
  Flame,
  Trophy,
  Clock3,
  Save,
  X,
  LogOut,
  Trash2,
  Mail,
  AtSign,
  CalendarDays,
  LockKeyhole,
  ExternalLink,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import DashboardLayout from "../../layout/DashboardLayout";
import { useTheme } from "../../context/ThemeContext";

const SETTINGS_STORAGE_KEY = "mentra-settings";
const PROFILE_STORAGE_KEY = "mentra-profile";

const DEFAULT_SETTINGS = {
  lessonReminders: true,
  streakReminders: true,
  achievementNotifications: true,
  dailyLearningGoal: 30,
  learningReminders: true,
};

const DEFAULT_PROFILE = {
  bio: "",
};

export default function Settings() {
  const { user, isLoaded, isSignedIn } = useUser();

  const {
    signOut,
    openUserProfile,
  } = useClerk();

  const { theme, setTheme } = useTheme();

  /* =========================================================
     SETTINGS
  ========================================================= */

  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem(
        SETTINGS_STORAGE_KEY
      );

      if (!saved) {
        return DEFAULT_SETTINGS;
      }

      return {
        ...DEFAULT_SETTINGS,
        ...JSON.parse(saved),
      };
    } catch (error) {
      console.error(
        "Failed to load Mentra settings:",
        error
      );

      return DEFAULT_SETTINGS;
    }
  });

  /* =========================================================
     PROFILE
  ========================================================= */

  const [profile, setProfile] = useState(
    DEFAULT_PROFILE
  );

  const [isEditingProfile, setIsEditingProfile] =
    useState(false);

  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
  });

  const [isSavingProfile, setIsSavingProfile] =
    useState(false);

  const [profileError, setProfileError] =
    useState("");

  const [profileSuccess, setProfileSuccess] =
    useState("");

  /* =========================================================
     ACCOUNT
  ========================================================= */

  const [accountError, setAccountError] =
    useState("");

  const [isSigningOut, setIsSigningOut] =
    useState(false);

  /* =========================================================
     DELETE ACCOUNT
  ========================================================= */

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [isDeletingAccount, setIsDeletingAccount] =
    useState(false);

  const [deleteError, setDeleteError] =
    useState("");

  /* =========================================================
     LOAD PROFILE
  ========================================================= */

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        PROFILE_STORAGE_KEY
      );

      if (!saved) {
        return;
      }

      setProfile({
        ...DEFAULT_PROFILE,
        ...JSON.parse(saved),
      });
    } catch (error) {
      console.error(
        "Failed to load Mentra profile:",
        error
      );
    }
  }, []);

  /* =========================================================
     LOAD CLERK PROFILE INTO FORM
  ========================================================= */

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      bio: profile.bio || "",
    });
  }, [user, profile.bio]);

  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(settings)
      );
    } catch (error) {
      console.error(
        "Failed to save Mentra settings:",
        error
      );
    }
  }, [settings]);

  function updateSetting(key, value) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function toggleSetting(key) {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  /* =========================================================
     PROFILE EDIT
  ========================================================= */

  function handleEditProfile() {
    setProfileError("");
    setProfileSuccess("");

    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      bio: profile.bio || "",
    });

    setIsEditingProfile(true);
  }

  function handleCancelProfileEdit() {
    if (isSavingProfile) return;

    setIsEditingProfile(false);
    setProfileError("");
    setProfileSuccess("");

    setProfileForm({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      bio: profile.bio || "",
    });
  }

  function handleProfileChange(
    field,
    value
  ) {
    setProfileForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSaveProfile() {
    if (!user || isSavingProfile) {
      return;
    }

    setIsSavingProfile(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      await user.update({
        firstName:
          profileForm.firstName.trim(),
        lastName:
          profileForm.lastName.trim(),
        username:
          profileForm.username.trim() ||
          undefined,
      });

      const updatedProfile = {
        bio: profileForm.bio.trim(),
      };

      setProfile(updatedProfile);

      localStorage.setItem(
        PROFILE_STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );

      setProfileSuccess(
        "Profile updated successfully."
      );

      setIsEditingProfile(false);

      setTimeout(() => {
        setProfileSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error
      );

      setProfileError(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Failed to update your profile. Please try again."
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  /* =========================================================
     MANAGE ACCOUNT
  ========================================================= */

  function handleManageAccount() {
    setAccountError("");

    try {
      openUserProfile();
    } catch (error) {
      console.error(
        "Failed to open account management:",
        error
      );

      setAccountError(
        "Unable to open account management. Please try again."
      );
    }
  }

  /* =========================================================
     SIGN OUT
  ========================================================= */

  async function handleSignOut() {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);
    setAccountError("");

    try {
      await signOut({
        redirectUrl: "/",
      });
    } catch (error) {
      console.error(
        "Failed to sign out:",
        error
      );

      setAccountError(
        error?.message ||
          "Failed to sign out. Please try again."
      );

      setIsSigningOut(false);
    }
  }

  /* =========================================================
     DELETE ACCOUNT
  ========================================================= */

  async function handleDeleteAccount() {
    if (!user || isDeletingAccount) {
      return;
    }

    setIsDeletingAccount(true);
    setDeleteError("");

    try {
      await user.delete();

      await signOut({
        redirectUrl: "/",
      });
    } catch (error) {
      console.error(
        "Failed to delete account:",
        error
      );

      setDeleteError(
        error?.errors?.[0]?.longMessage ||
          error?.errors?.[0]?.message ||
          error?.message ||
          "Failed to delete your account. Please try again."
      );

      setIsDeletingAccount(false);
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (!isLoaded) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center bg-[var(--mentra-bg)]">
          <Loader2
            size={32}
            className="animate-spin text-violet-500"
          />
        </div>
      </DashboardLayout>
    );
  }

  /* =========================================================
     AUTH CHECK
  ========================================================= */

  if (!isSignedIn || !user) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center bg-[var(--mentra-bg)] px-4 text-[var(--mentra-text)]">
          <div className="w-full max-w-md rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-8 text-center">
            <Shield
              size={42}
              className="mx-auto mb-4 text-violet-500"
            />

            <h2 className="text-xl font-bold">
              Sign in required
            </h2>

            <p className="mt-2 text-sm text-[var(--mentra-text-muted)]">
              Please sign in to access your Mentra
              settings.
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const displayName =
    user.fullName ||
    [user.firstName, user.lastName]
      .filter(Boolean)
      .join(" ") ||
    user.username ||
    "Mentra User";

  const email =
    user.primaryEmailAddress
      ?.emailAddress ||
    "No email available";

  const emailVerified =
    user.primaryEmailAddress
      ?.verification?.status ===
    "verified";

  const createdAt = user.createdAt
    ? new Date(
        user.createdAt
      ).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[var(--mentra-bg)] px-4 py-8 text-[var(--mentra-text)] transition-colors duration-200 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          {/* =========================
              HEADER
          ========================= */}

          <div className="mb-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
              <Shield size={13} />
              Preferences
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Settings
            </h1>

            <p className="mt-2 max-w-2xl text-[var(--mentra-text-muted)]">
              Customize your Mentra experience,
              learning preferences, account, and
              notifications.
            </p>
          </div>

          {/* =========================
              PROFILE
          ========================= */}

          <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
            <SectionHeader
              icon={User}
              title="Profile"
              description="Manage your Mentra profile"
            />

            {!isEditingProfile ? (
              <>
                <div className="flex flex-col gap-4 rounded-2xl bg-[var(--mentra-surface-2)] p-5 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex min-w-0 items-center gap-4">

                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt="Profile"
                        className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-violet-500/20"
                      />
                    ) : (
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-500 text-xl font-bold text-white">
                        {user.firstName?.charAt(
                          0
                        ) || "M"}
                      </div>
                    )}

                    <div className="min-w-0">

                      <p className="text-lg font-semibold text-[var(--mentra-text)]">
                        {displayName}
                      </p>

                      {user.username && (
                        <p className="mt-1 flex items-center gap-1 text-sm text-[var(--mentra-text-muted)]">
                          <AtSign size={14} />
                          {user.username}
                        </p>
                      )}

                      <p className="mt-1 truncate text-sm text-[var(--mentra-text-muted)]">
                        {email}
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Account connected
                      </div>

                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleEditProfile}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    <User size={16} />
                    Edit Profile
                  </button>

                </div>

                {profileSuccess && (
                  <div className="mt-4">
                    <MessageBox
                      type="success"
                      message={profileSuccess}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl bg-[var(--mentra-surface-2)] p-5">

                <div className="mb-6">
                  <h3 className="font-semibold">
                    Edit Profile
                  </h3>

                  <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
                    Update your personal information.
                  </p>
                </div>

                {profileError && (
                  <div className="mb-5">
                    <MessageBox
                      type="error"
                      message={profileError}
                    />
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">

                  <InputField
                    label="First name"
                    value={
                      profileForm.firstName
                    }
                    onChange={(value) =>
                      handleProfileChange(
                        "firstName",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Last name"
                    value={
                      profileForm.lastName
                    }
                    onChange={(value) =>
                      handleProfileChange(
                        "lastName",
                        value
                      )
                    }
                  />

                </div>

                <div className="mt-5">
                  <InputField
                    label="Username"
                    value={
                      profileForm.username
                    }
                    onChange={(value) =>
                      handleProfileChange(
                        "username",
                        value
                      )
                    }
                  />
                </div>

                <div className="mt-5">

                  <label className="mb-2 block text-sm font-medium">
                    Bio
                  </label>

                  <textarea
                    rows={4}
                    maxLength={250}
                    value={profileForm.bio}
                    onChange={(event) =>
                      handleProfileChange(
                        "bio",
                        event.target.value
                      )
                    }
                    placeholder="Tell other learners a little about yourself..."
                    className="w-full resize-none rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-3 text-sm text-[var(--mentra-text)] outline-none transition placeholder:text-[var(--mentra-text-muted)] focus:border-violet-500"
                  />

                  <p className="mt-1 text-right text-xs text-[var(--mentra-text-muted)]">
                    {profileForm.bio.length}/250
                  </p>

                </div>

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={
                      handleSaveProfile
                    }
                    disabled={
                      isSavingProfile
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingProfile ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Save size={16} />
                    )}

                    {isSavingProfile
                      ? "Saving..."
                      : "Save Changes"}
                  </button>

                  <button
                    type="button"
                    onClick={
                      handleCancelProfileEdit
                    }
                    disabled={
                      isSavingProfile
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--mentra-border)] px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                </div>

              </div>
            )}
          </section>

          {/* =========================
              APPEARANCE
          ========================= */}

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

          {/* =========================
              NOTIFICATIONS
          ========================= */}

          <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
            <SectionHeader
              icon={Bell}
              title="Notifications"
              description="Manage your learning reminders."
            />

            <div className="space-y-3">

              <SettingRow
                icon={BookOpen}
                title="Lesson reminders"
                description="Get reminded to continue your learning."
                enabled={
                  settings.lessonReminders
                }
                onToggle={() =>
                  toggleSetting(
                    "lessonReminders"
                  )
                }
              />

              <SettingRow
                icon={Flame}
                title="Streak reminders"
                description="Don't lose your learning streak."
                enabled={
                  settings.streakReminders
                }
                onToggle={() =>
                  toggleSetting(
                    "streakReminders"
                  )
                }
              />

              <SettingRow
                icon={Trophy}
                title="Achievement notifications"
                description="Get notified when you unlock achievements."
                enabled={
                  settings.achievementNotifications
                }
                onToggle={() =>
                  toggleSetting(
                    "achievementNotifications"
                  )
                }
              />

            </div>
          </section>

          {/* =========================
              LEARNING
          ========================= */}

          <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">
            <SectionHeader
              icon={BookOpen}
              title="Learning"
              description="Customize your learning experience."
            />

            <div className="space-y-3">

              {/* DAILY GOAL */}

              <div className="rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                      <Target size={18} />
                    </div>

                    <div>
                      <p className="font-medium">
                        Daily learning goal
                      </p>

                      <p className="mt-1 text-sm text-[var(--mentra-text-muted)]">
                        Choose how long you want to learn each day.
                      </p>
                    </div>

                  </div>

                  <select
                    value={
                      settings.dailyLearningGoal
                    }
                    onChange={(event) =>
                      updateSetting(
                        "dailyLearningGoal",
                        Number(
                          event.target.value
                        )
                      )
                    }
                    className="rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-2.5 text-sm font-medium text-[var(--mentra-text)] outline-none transition focus:border-violet-500"
                  >
                    <option value={15}>
                      15 minutes
                    </option>

                    <option value={30}>
                      30 minutes
                    </option>

                    <option value={45}>
                      45 minutes
                    </option>

                    <option value={60}>
                      1 hour
                    </option>

                    <option value={90}>
                      1.5 hours
                    </option>

                    <option value={120}>
                      2 hours
                    </option>
                  </select>

                </div>

              </div>

              {/* LEARNING REMINDERS */}

              <SettingRow
                icon={Clock3}
                title="Learning reminders"
                description="Receive reminders about your learning plan."
                enabled={
                  settings.learningReminders
                }
                onToggle={() =>
                  toggleSetting(
                    "learningReminders"
                  )
                }
              />

            </div>
          </section>

          {/* =========================
              ACCOUNT & SECURITY
          ========================= */}

          <section className="mb-6 rounded-3xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] p-6 transition-colors duration-200">

            <SectionHeader
              icon={Shield}
              title="Account & Security"
              description="Manage your Mentra account."
            />

            <div className="space-y-3">

              <AccountRow
                icon={Mail}
                label="Email address"
                value={email}
                verified={emailVerified}
              />

              <AccountRow
                icon={AtSign}
                label="Username"
                value={
                  user.username
                    ? `@${user.username}`
                    : "Not set"
                }
              />

              <AccountRow
                icon={Shield}
                label="Account ID"
                value={user.id}
                mono
              />

              <AccountRow
                icon={CalendarDays}
                label="Account created"
                value={createdAt}
              />

              <AccountRow
                icon={LockKeyhole}
                label="Authentication"
                value="Clerk"
              />

              <AccountRow
                icon={LockKeyhole}
                label="Password"
                value="Managed securely by Clerk"
              />

              {accountError && (
                <MessageBox
                  type="error"
                  message={accountError}
                />
              )}

              <div className="flex flex-col gap-3 border-t border-[var(--mentra-border)] pt-5 sm:flex-row">

                <button
                  type="button"
                  onClick={
                    handleManageAccount
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--mentra-border)] px-5 py-3 text-sm font-semibold transition hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <ExternalLink
                    size={16}
                  />
                  Manage Account
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-400 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSigningOut ? (
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                  ) : (
                    <LogOut size={16} />
                  )}

                  {isSigningOut
                    ? "Signing Out..."
                    : "Sign Out"}
                </button>

              </div>

            </div>
          </section>

          {/* =========================
              DANGER ZONE
          ========================= */}

          <section className="rounded-3xl border border-red-500/20 bg-[var(--mentra-surface)] p-6 transition-colors duration-200">

            <SectionHeader
              icon={Trash2}
              title="Danger Zone"
              description="Permanent account actions."
            />

            {!showDeleteConfirm ? (
              <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-5">

                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="font-medium text-[var(--mentra-text)]">
                      Delete account
                    </p>

                    <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--mentra-text-muted)]">
                      Permanently delete your Mentra
                      account. This action cannot be
                      undone.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError("");
                      setShowDeleteConfirm(
                        true
                      );
                    }}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                    Delete Account
                  </button>

                </div>

              </div>
            ) : (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">

                <div className="flex items-start gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
                    <AlertTriangle
                      size={18}
                    />
                  </div>

                  <div>
                    <p className="font-semibold text-red-400">
                      Are you absolutely sure?
                    </p>

                    <p className="mt-1 text-sm leading-6 text-[var(--mentra-text-muted)]">
                      Your Clerk account will be
                      permanently deleted. This
                      action cannot be undone.
                    </p>
                  </div>

                </div>

                {deleteError && (
                  <div className="mt-4">
                    <MessageBox
                      type="error"
                      message={deleteError}
                    />
                  </div>
                )}

                <div className="mt-5 flex flex-wrap gap-3">

                  <button
                    type="button"
                    onClick={
                      handleDeleteAccount
                    }
                    disabled={
                      isDeletingAccount
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeletingAccount ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Trash2 size={16} />
                    )}

                    {isDeletingAccount
                      ? "Deleting..."
                      : "Yes, Delete My Account"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        isDeletingAccount
                      ) {
                        return;
                      }

                      setShowDeleteConfirm(
                        false
                      );
                      setDeleteError("");
                    }}
                    disabled={
                      isDeletingAccount
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-[var(--mentra-border)] px-5 py-2.5 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <X size={16} />
                    Cancel
                  </button>

                </div>

              </div>
            )}

          </section>

          {/* =========================
              FOOTER
          ========================= */}

          <p className="mt-8 text-center text-xs text-[var(--mentra-text-subtle)]">
            Your preferences are saved automatically
            on this device.
          </p>

        </div>
      </div>
    </DashboardLayout>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="mb-6 flex items-center gap-3">

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
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

/* =========================================================
   THEME OPTION
========================================================= */

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
      aria-pressed={active}
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

/* =========================================================
   SETTING ROW
========================================================= */

function SettingRow({
  icon: Icon,
  title,
  description,
  enabled,
  onToggle,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4 transition-colors duration-200">

      <div className="flex min-w-0 items-start gap-3">

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
            enabled
              ? "bg-violet-500/10 text-violet-400"
              : "bg-[var(--mentra-surface)] text-[var(--mentra-text-subtle)]"
          }`}
        >
          <Icon size={17} />
        </div>

        <div>
          <p className="font-medium text-[var(--mentra-text)]">
            {title}
          </p>

          <p className="mt-1 text-sm leading-5 text-[var(--mentra-text-muted)]">
            {description}
          </p>
        </div>

      </div>

      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`Toggle ${title}`}
        onClick={onToggle}
        className={`relative h-7 w-12 shrink-0 rounded-full p-1 transition-colors duration-200 ${
          enabled
            ? "bg-violet-600"
            : "bg-[var(--mentra-border)]"
        }`}
      >
        <span
          className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
            enabled
              ? "translate-x-5"
              : "translate-x-0"
          }`}
        />
      </button>

    </div>
  );
}

/* =========================================================
   ACCOUNT ROW
========================================================= */

function AccountRow({
  icon: Icon,
  label,
  value,
  verified = false,
  mono = false,
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-[var(--mentra-border)] bg-[var(--mentra-surface-2)] p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--mentra-surface)] text-[var(--mentra-text-muted)]">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-xs text-[var(--mentra-text-muted)]">
          {label}
        </p>

        <div className="mt-1 flex items-center gap-2">

          <p
            className={`truncate text-sm font-medium text-[var(--mentra-text)] ${
              mono ? "font-mono text-xs" : ""
            }`}
          >
            {value}
          </p>

          {verified && (
            <Check
              size={15}
              className="shrink-0 text-emerald-400"
            />
          )}

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   INPUT FIELD
========================================================= */

function InputField({
  label,
  value,
  onChange,
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-[var(--mentra-text)]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[var(--mentra-border)] bg-[var(--mentra-surface)] px-4 py-3 text-sm text-[var(--mentra-text)] outline-none transition placeholder:text-[var(--mentra-text-muted)] focus:border-violet-500"
      />

    </div>
  );
}

/* =========================================================
   MESSAGE BOX
========================================================= */

function MessageBox({
  type,
  message,
}) {
  const success = type === "success";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        success
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
          : "border-red-500/20 bg-red-500/10 text-red-400"
      }`}
    >
      {success ? (
        <Check
          size={17}
          className="mt-0.5 shrink-0"
        />
      ) : (
        <AlertTriangle
          size={17}
          className="mt-0.5 shrink-0"
        />
      )}

      <span>{message}</span>
    </div>
  );
}
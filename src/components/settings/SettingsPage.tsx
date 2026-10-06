"use client";

import { useState } from "react";
import {
  Bell,
  BarChart3,
  Languages,
  SlidersHorizontal,
  SlidersVertical,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  AppShell,
  DashboardPageBody,
  DashboardPageHeader,
} from "@/src/components/layout/AppShell";
import { DashboardPageTabs } from "@/src/components/layout/DashboardPageTabs";
import { LanguageSelect } from "@/src/components/i18n/LanguageSelect";
import { ManageLanguagesModal } from "@/src/components/settings/ManageLanguagesModal";
import { useI18n } from "@/src/hooks/useI18n";

type SettingsScope = "user" | "org";
type SettingsSection =
  | "preferences"
  | "profile"
  | "chat"
  | "analytics"
  | "language";

const SECTION_ICON: Record<SettingsSection, typeof UserRound> = {
  preferences: SlidersHorizontal,
  profile: UserRound,
  chat: Bell,
  analytics: BarChart3,
  language: Languages,
};

export function SettingsPage() {
  const { t } = useI18n();
  const [scope, setScope] = useState<SettingsScope>("user");
  const [section, setSection] = useState<SettingsSection>("language");

  const sections: { id: SettingsSection; label: string }[] = [
    { id: "preferences", label: t("Preferences") },
    { id: "profile", label: t("Profile") },
    { id: "chat", label: t("Chat Preferences") },
    { id: "analytics", label: t("Analytics") },
    { id: "language", label: t("Language") },
  ];

  return (
    <AppShell activeNav="settings">
      <DashboardPageHeader
        title={t("Settings")}
        tabs={
          <DashboardPageTabs
            tabs={[
              { id: "user", label: t("User") },
              { id: "org", label: t("Organization") },
            ]}
            activeId={scope}
            onChange={(id) => setScope(id as SettingsScope)}
          />
        }
      />

      <DashboardPageBody>
        <p className="mb-6 max-w-2xl text-[14px] leading-[1.5] text-[#65686B]">
          {t("Manage your account, preferences, and workspace settings.")}
        </p>

        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          <nav className="flex shrink-0 flex-col gap-1 md:w-56">
            {sections.map((item) => {
              const Icon = SECTION_ICON[item.id];
              const active = item.id === section;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={cn(
                    "flex h-10 items-center gap-2.5 rounded-lg px-3 text-start text-[14px] font-medium leading-[1.24] transition-colors",
                    active
                      ? "bg-[#F0F2F5] text-[#171717]"
                      : "text-[#525252] hover:bg-[#F0F2F5]/70",
                  )}
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.8} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <section className="min-w-0 flex-1 rounded-2xl border border-[#E8EAED] bg-white p-6 md:p-8">
            {section === "language" ? (
              <LanguagePanel />
            ) : (
              <PlaceholderPanel title={sections.find((s) => s.id === section)?.label ?? ""} />
            )}
          </section>
        </div>
      </DashboardPageBody>
    </AppShell>
  );
}

function LanguagePanel() {
  const { t } = useI18n();
  const [manageOpen, setManageOpen] = useState(false);
  return (
    <div className="flex max-w-xl flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h2 className="text-[18px] font-semibold leading-[1.3] text-[#171717]">
          {t("Interface language")}
        </h2>
        <p className="text-[14px] leading-[1.5] text-[#65686B]">
          {t(
            "Choose the language used for menus, buttons, and labels across the platform.",
          )}
        </p>
      </div>

      <LanguageSelect allLanguages />

      <button
        type="button"
        onClick={() => setManageOpen(true)}
        className="inline-flex w-fit items-center gap-1.5 text-[13px] font-medium leading-[1.4] text-[#65686B] transition-colors hover:text-[#4C61DB]"
      >
        <SlidersVertical className="size-3.5" strokeWidth={1.9} />
        {t("Manage available languages")}
      </button>

      <p className="rounded-lg bg-[#F7F8FA] px-3.5 py-3 text-[13px] leading-[1.5] text-[#65686B]">
        {t(
          "This changes the interface only. Reports keep the language they were created in.",
        )}
      </p>

      {manageOpen ? <ManageLanguagesModal onClose={() => setManageOpen(false)} /> : null}
    </div>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-[18px] font-semibold leading-[1.3] text-[#171717]">{title}</h2>
      <p className="text-[14px] leading-[1.5] text-[#969A9E]">—</p>
    </div>
  );
}

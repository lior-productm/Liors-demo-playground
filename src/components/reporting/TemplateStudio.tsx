"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { ReportActiveView } from "@/src/components/reporting/ReportActiveView";
import { TemplateCollection } from "@/src/components/reporting/TemplateCollection";
import { SectionCollection } from "@/src/components/reporting/SectionCollection";
import { CreateSectionBuilder } from "@/src/components/reporting/CreateSectionBuilder";
import { NewTemplateModal } from "@/src/components/reporting/NewTemplateModal";
import { createTemplate, type CreateTemplateInput } from "@/src/lib/reportTemplates";
import { saveSectionToLibrary } from "@/src/lib/reportSectionLibrary";
import type { CustomReportSection } from "@/src/lib/reportSectionBuilder";

type LandingTab = "templates" | "sections";

/**
 * Template Studio shell: a collection landing (gallery of templates + the
 * new-template creation flow) that opens into the full section/object editor.
 */
export function TemplateStudio() {
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [landingTab, setLandingTab] = useState<LandingTab>("templates");
  const [creatingSection, setCreatingSection] = useState(false);
  const [sectionRefreshKey, setSectionRefreshKey] = useState(0);

  const handleCreate = (input: CreateTemplateInput) => {
    const meta = createTemplate(input);
    setShowNewTemplate(false);
    setOpenTitle(meta.title);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: `“${meta.title}” template created.` },
      }),
    );
  };

  const handleCreateLibrarySection = (section: CustomReportSection) => {
    saveSectionToLibrary({
      title: section.title,
      description: section.summary.calculationLogic,
      blocks: section.blocks,
    });
    setCreatingSection(false);
    setSectionRefreshKey((value) => value + 1);
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: `“${section.title}” saved to the section library.` },
      }),
    );
  };

  return (
    <>
      {openTitle ? (
        <ReportActiveView
          key={openTitle}
          variant="studio"
          openTitle={openTitle}
          onBackToCollection={() => setOpenTitle(null)}
          onRequestNewTemplate={() => setShowNewTemplate(true)}
        />
      ) : (
        <div className="flex flex-col gap-5">
          <div className="inline-flex w-fit rounded-lg border border-[#E6E8EB] bg-[#FAFBFC] p-1">
            {(["templates", "sections"] as LandingTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setLandingTab(tab)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-[13px] font-medium capitalize leading-[1.24] transition-colors",
                  landingTab === tab
                    ? "bg-white text-[#111] shadow-sm"
                    : "text-[#65686B] hover:text-[#353638]",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {landingTab === "templates" ? (
            <TemplateCollection
              onOpen={setOpenTitle}
              onNewTemplate={() => setShowNewTemplate(true)}
            />
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-0.5">
                <h2 className="text-[18px] font-semibold leading-[1.25] text-[#05091F]">
                  Sections
                </h2>
                <p className="text-[13px] leading-[1.5] text-[#65686B]">
                  Reusable sections you can add to any template. Create a new
                  section here to grow this library, then open a template to
                  insert them.
                </p>
              </div>
              <SectionCollection
                onNewSection={() => setCreatingSection(true)}
                refreshKey={sectionRefreshKey}
                emptyHint="No sections yet."
              />
            </div>
          )}
        </div>
      )}

      {showNewTemplate ? (
        <NewTemplateModal
          onClose={() => setShowNewTemplate(false)}
          onCreate={handleCreate}
        />
      ) : null}

      {creatingSection ? (
        <div
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/30 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setCreatingSection(false)}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-[900px] overflow-hidden"
            onClick={(event) => event.stopPropagation()}
          >
            <CreateSectionBuilder
              reportTitle="Section library"
              mode="library"
              onCancel={() => setCreatingSection(false)}
              onApprove={handleCreateLibrarySection}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

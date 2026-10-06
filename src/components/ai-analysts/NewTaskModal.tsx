"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Clock, FileText, SquarePen } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CARD_BORDER,
  Eyebrow,
  LinkChip,
  MODAL_OVERLAY_CLASS,
  ModalCloseButton,
  OutlineButton,
  PrimaryButton,
  ScopeLevelIcon,
  Tag,
} from "@/src/components/ai-analysts/AiAnalystsPrimitives";
import {
  FREQUENCY_LABEL,
  SCOPE_LEVEL_LABEL,
  getAnalyst,
  getTemplatesForAnalyst,
} from "@/src/lib/aiAnalystsData";
import type { AnalystId, TemplateDef } from "@/src/types/aiAnalysts";
import { useI18n } from "@/src/hooks/useI18n";

type StartChoice = "template" | "custom";

export function NewTaskModal({
  open,
  analystId,
  onOpenChange,
  onPickTemplate,
  onCustom,
}: {
  open: boolean;
  analystId: AnalystId;
  onOpenChange: (open: boolean) => void;
  onPickTemplate: (template: TemplateDef) => void;
  onCustom: () => void;
}) {
  const { t } = useI18n();
  const [choice, setChoice] = useState<StartChoice | null>(null);
  const [pickingTemplate, setPickingTemplate] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const templates = getTemplatesForAnalyst(analystId);
  const analyst = getAnalyst(analystId);

  useEffect(() => {
    if (open) {
      setChoice(null);
      setPickingTemplate(false);
      setTemplateId(null);
    }
  }, [open, analystId]);

  const canContinue = pickingTemplate ? Boolean(templateId) : choice !== null;

  const handleContinue = () => {
    if (!pickingTemplate) {
      if (choice === "custom") {
        onCustom();
        return;
      }
      setPickingTemplate(true);
      return;
    }
    const picked = templates.find((item) => item.id === templateId);
    if (picked) onPickTemplate(picked);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName={MODAL_OVERLAY_CLASS}
        aria-describedby={undefined}
        className="flex max-h-[90vh] w-[645px] max-w-[94vw] flex-col gap-0 overflow-hidden rounded-[12px] border-0 bg-white p-0 shadow-[0_10px_28px_rgba(0,0,0,0.14)]"
      >
        <ModalCloseButton onClick={() => onOpenChange(false)} className="right-4 top-4" />

        <div className="flex flex-col gap-2 px-6 pt-6">
          <Eyebrow className="text-[12px] leading-4">New task</Eyebrow>
          <DialogTitle className="text-[16px] font-medium leading-6 tracking-normal text-[#121212]">
            {pickingTemplate ? `Choose a ${t(analyst?.name ?? "")} Analyst template` : "How do you want to start?"}
          </DialogTitle>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {pickingTemplate ? (
            <div className="flex flex-col gap-2">
              {templates.map((tpl) => {
                const selected = templateId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    className={cn(
                      "flex items-start justify-between gap-4 rounded-[12px] border bg-white p-4 text-left transition-colors",
                      selected ? "border-[#A7B2F2] bg-[#F5F6FD]" : "border-[#E6E8EB] hover:border-[#D1D5D9]",
                    )}
                  >
                    <span className="min-w-0">
                      <span className="block text-[14px] font-medium leading-5 text-[#121212]">{t(tpl.name)}</span>
                      <span className="mt-1 line-clamp-2 block text-[12px] leading-4 text-[#65686B]">
                        {t(tpl.description)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <LinkChip icon={<ScopeLevelIcon level={tpl.defaultScopeLevel} size={12} />}>
                        {t(SCOPE_LEVEL_LABEL[tpl.defaultScopeLevel])}
                      </LinkChip>
                      <Tag icon={<Clock size={16} strokeWidth={1.5} />}>{t(FREQUENCY_LABEL[tpl.defaultFrequency])}</Tag>
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <OptionCard
                selected={choice === "template"}
                onClick={() => setChoice("template")}
                icon={<FileText size={20} strokeWidth={1.5} />}
                title="From a template"
                description="Choose an already-made task template from the Analysts section, then customize its scope and frequency to fit your needs."
              />
              <OptionCard
                selected={choice === "custom"}
                onClick={() => setChoice("custom")}
                icon={<SquarePen size={20} strokeWidth={1.5} />}
                title="Custom"
                description="Chat with Amiio and tell it what you need. The AI will instantly create and set up a personalized task for you."
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[#E6E8EB] px-6 py-5">
          {pickingTemplate ? (
            <OutlineButton size="md" onClick={() => setPickingTemplate(false)}>
              <ArrowLeft size={16} strokeWidth={1.5} /> Back
            </OutlineButton>
          ) : (
            <OutlineButton size="md" onClick={() => onOpenChange(false)}>
              Cancel
            </OutlineButton>
          )}
          <PrimaryButton size="md" disabled={!canContinue} onClick={handleContinue}>
            Continue <ArrowRight size={16} strokeWidth={1.5} />
          </PrimaryButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-full flex-col gap-3 rounded-[12px] bg-white p-4 text-left transition-all",
        CARD_BORDER,
        selected
          ? "border-[#A7B2F2] bg-[#F5F6FD] shadow-[0_0_1px_3px_rgba(76,97,219,0.3)]"
          : "hover:border-[#D1D5D9]",
      )}
    >
      <span className="flex items-center justify-between text-[#121212]">
        {icon}
        <ArrowRight size={16} strokeWidth={1.5} className="text-[#65686B]" />
      </span>
      <span className="block text-[16px] font-medium leading-6 text-[#121212]">{title}</span>
      <span className="block text-[14px] leading-5 text-[#65686B]">{description}</span>
    </button>
  );
}

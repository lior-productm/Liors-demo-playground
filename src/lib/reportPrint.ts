import type { LanguageCode, TextDirection } from "@/src/lib/i18n";

type PrintOptions = {
  title: string;
  lang: LanguageCode;
  dir: TextDirection;
};

/**
 * Opens a print-ready window containing a clone of the rendered report document,
 * carrying over the page stylesheets plus the report's language/direction. Used
 * for the "Download PDF file" action (print → Save as PDF).
 */
export function printReportDocument(node: HTMLElement, options: PrintOptions): void {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "noopener,noreferrer,width=900,height=1200");
  if (!printWindow) {
    window.dispatchEvent(
      new CustomEvent("amiio:toast", {
        detail: { message: "Allow pop-ups to download the report as a PDF." },
      }),
    );
    return;
  }

  const headStyles = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style'),
  )
    .map((element) => element.outerHTML)
    .join("\n");

  const doc = printWindow.document;
  doc.open();
  doc.write(`<!doctype html>
<html lang="${options.lang}" dir="${options.dir}">
  <head>
    <meta charset="utf-8" />
    <title>${options.title}</title>
    ${headStyles}
    <style>
      body { margin: 0; padding: 24px; background: #fff; }
      @page { margin: 16mm; }
    </style>
  </head>
  <body>${node.outerHTML}</body>
</html>`);
  doc.close();

  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
  };

  // Give fonts/styles a tick to apply before printing.
  if (doc.readyState === "complete") {
    window.setTimeout(triggerPrint, 250);
  } else {
    printWindow.addEventListener("load", () => window.setTimeout(triggerPrint, 250));
  }
}

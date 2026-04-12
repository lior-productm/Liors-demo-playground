import { redirect } from "next/navigation";

/** Legacy URL: browser experience was removed from the product nav. */
export default function BrowserPage() {
  redirect("/commercial");
}
